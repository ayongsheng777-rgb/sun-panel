package tools

import (
	"fmt"
	"net"
	"strings"
	"sync"
	"time"

	"sun-panel/global"
	"sun-panel/models"

	"gorm.io/gorm"
)

// 批量整理类工具：内网归组、失效网址体检
func BatchTools() []Tool {
	return []Tool{batchMoveIntranetTool{}, checkDeadLinksTool{}}
}

// ===================== 内网判定（死规则，不依赖 LLM） =====================

// isIntranetHost 判定主机是否为内网地址：
// 私网 IP 段（10/8、172.16~31、192.168）、回环/链路本地、localhost、
// .local/.lan/.internal/.home 后缀、无点主机名（如 nas、openwrt）。
func isIntranetHost(hostport string) bool {
	host := strings.ToLower(strings.TrimSpace(hostport))
	if host == "" {
		return false
	}
	if h, _, err := net.SplitHostPort(host); err == nil {
		host = h
	}
	host = strings.Trim(host, "[]")
	if host == "localhost" || host == "::1" {
		return true
	}
	for _, suf := range []string{".local", ".lan", ".internal", ".home"} {
		if strings.HasSuffix(host, suf) {
			return true
		}
	}
	if ip := net.ParseIP(host); ip != nil {
		return ip.IsPrivate() || ip.IsLoopback() || ip.IsLinkLocalUnicast()
	}
	// 无点主机名（没有域名单段主机）
	if !strings.Contains(host, ".") {
		return true
	}
	return false
}

// isIntranetItem 以主链接判定该网址是否为内网地址
func isIntranetItem(it models.ItemIcon) bool {
	u := strings.TrimSpace(it.Url)
	u = strings.TrimPrefix(strings.ToLower(u), "http://")
	u = strings.TrimPrefix(u, "https://")
	host := u
	if i := strings.Index(host, "/"); i >= 0 {
		host = host[:i]
	}
	return isIntranetHost(host)
}

// findOrCreateGroupTx 按名找分组，没有就建（带图标），返回分组 ID 与是否新建
func findOrCreateGroupTx(tx *gorm.DB, userId uint, title, icon string) (uint, bool, error) {
	if g, err := FindGroupByNameTx(tx, userId, title); err == nil {
		return g.ID, false, nil
	}
	ng := models.ItemIconGroup{
		Title: title, UserId: userId, Sort: 9999,
		Icon: icon,
	}
	if err := tx.Create(&ng).Error; err != nil {
		return 0, false, err
	}
	return ng.ID, true, nil
}

// ===================== panel.batch_move_intranet =====================

type batchMoveIntranetTool struct{}

func (batchMoveIntranetTool) Name() string           { return "panel.batch_move_intranet" }
func (batchMoveIntranetTool) Permission() Permission { return PermissionUpdate }
func (batchMoveIntranetTool) Description() string {
	return "把面板里所有内网地址（局域网 IP、localhost、主机名）批量归纳到指定分组"
}
func (batchMoveIntranetTool) ParamsSchema() map[string]string {
	return map[string]string{"targetGroup": "目标分组名，默认「APP导航」"}
}

func (batchMoveIntranetTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		TargetGroup string `json:"targetGroup"`
	}
	ec.Bind(&p)
	target := strings.TrimSpace(p.TargetGroup)
	if target == "" {
		target = "APP导航"
	}

	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	intranet := []models.ItemIcon{}
	for _, it := range items {
		if isIntranetItem(it) {
			intranet = append(intranet, it)
		}
	}
	if len(intranet) == 0 {
		return Result{Kind: "reply", Reply: "面板里没有发现内网地址的网址"}, nil
	}

	moved, created := 0, false
	txErr := global.Db.Transaction(func(tx *gorm.DB) error {
		gid, c, err := findOrCreateGroupTx(tx, ec.UserId, target, "material-symbols:apps")
		if err != nil {
			return err
		}
		created = c
		for _, it := range intranet {
			if it.ItemIconGroupId == int(gid) {
				continue
			}
			if err := tx.Model(&models.ItemIcon{}).Where("id=? AND user_id=?", it.ID, ec.UserId).
				Update("item_icon_group_id", gid).Error; err != nil {
				return err
			}
			moved++
		}
		return nil
	})
	if txErr != nil {
		return Result{}, txErr
	}

	names := make([]string, 0, len(intranet))
	for i, it := range intranet {
		if i >= 15 {
			names = append(names, fmt.Sprintf("…等共 %d 个", len(intranet)))
			break
		}
		names = append(names, it.Title)
	}
	LogOp(ec.UserId, "batch_move_intranet", fmt.Sprintf("内网归组：%d 个移到「%s」", moved, target), "", "")

	msg := fmt.Sprintf("找到 %d 个内网地址：%s", len(intranet), strings.Join(names, "、"))
	if created {
		msg += fmt.Sprintf("\n已新建分组「%s」", target)
	}
	if moved > 0 {
		msg += fmt.Sprintf("\n已把其中 %d 个归到「%s」分组（原本就在的未动）", moved, target)
	} else {
		msg += fmt.Sprintf("\n它们本来就已经在「%s」分组里，无需调整", target)
	}
	return Result{Kind: "changed", Reply: msg, Changed: moved > 0 || created}, nil
}

// ===================== panel.check_dead_links =====================

type checkDeadLinksTool struct{}

func (checkDeadLinksTool) Name() string           { return "panel.check_dead_links" }
func (checkDeadLinksTool) Permission() Permission { return PermissionUpdate }
func (checkDeadLinksTool) Description() string {
	return "体检全部网址的可达性（内网地址跳过不查），两轮都打不开的归到「失效网址」分组"
}
func (checkDeadLinksTool) ParamsSchema() map[string]string {
	return map[string]string{"targetGroup": "失效网址归纳的分组名，默认「失效网址」"}
}

type probeOutcome struct {
	item  models.ItemIcon
	alive bool
}

// probeAll 并发探活一轮，返回不通的条目（并发上限 10，单条 6s）
func probeAll(items []models.ItemIcon) []models.ItemIcon {
	results := make([]probeOutcome, len(items))
	var wg sync.WaitGroup
	sem := make(chan struct{}, 10)
	for i, it := range items {
		wg.Add(1)
		go func(i int, it models.ItemIcon) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			results[i] = probeOutcome{item: it, alive: URLReachable(it.Url, 6*time.Second)}
		}(i, it)
	}
	wg.Wait()
	dead := []models.ItemIcon{}
	for _, r := range results {
		if !r.alive {
			dead = append(dead, r.item)
		}
	}
	return dead
}

func (checkDeadLinksTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		TargetGroup string `json:"targetGroup"`
	}
	ec.Bind(&p)
	target := strings.TrimSpace(p.TargetGroup)
	if target == "" {
		target = "失效网址"
	}

	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	if len(items) == 0 {
		return Result{Kind: "reply", Reply: "面板里还没有网址"}, nil
	}

	// 内网地址跳过（用户拍板：内网不参与失效检查，避免网段不同误伤）
	checkList := []models.ItemIcon{}
	skippedIntranet := 0
	for _, it := range items {
		if isIntranetItem(it) {
			skippedIntranet++
			continue
		}
		checkList = append(checkList, it)
	}

	// 两轮探活：第一轮全量，3 秒后第二轮只复查不通的，两轮都不通才算失效
	round1 := probeAll(checkList)
	dead := []models.ItemIcon{}
	if len(round1) > 0 {
		time.Sleep(3 * time.Second)
		dead = probeAll(round1)
	}
	alive := len(checkList) - len(dead)

	if len(dead) == 0 {
		msg := fmt.Sprintf("体检完成：%d 个网址全部能打开", len(checkList))
		if skippedIntranet > 0 {
			msg += fmt.Sprintf("（%d 个内网地址按约定跳过未查）", skippedIntranet)
		}
		return Result{Kind: "reply", Reply: msg}, nil
	}

	// 移动失效项到目标分组
	moved, created := 0, false
	txErr := global.Db.Transaction(func(tx *gorm.DB) error {
		gid, c, err := findOrCreateGroupTx(tx, ec.UserId, target, "material-symbols:link-off")
		if err != nil {
			return err
		}
		created = c
		for _, it := range dead {
			if it.ItemIconGroupId == int(gid) {
				continue
			}
			if err := tx.Model(&models.ItemIcon{}).Where("id=? AND user_id=?", it.ID, ec.UserId).
				Update("item_icon_group_id", gid).Error; err != nil {
				return err
			}
			moved++
		}
		return nil
	})
	if txErr != nil {
		return Result{}, txErr
	}

	names := make([]string, 0, len(dead))
	for i, it := range dead {
		if i >= 15 {
			names = append(names, fmt.Sprintf("…等共 %d 个", len(dead)))
			break
		}
		names = append(names, it.Title)
	}
	LogOp(ec.UserId, "check_dead_links", fmt.Sprintf("失效体检：%d 个失效移到「%s」", moved, target), "", "")

	msg := fmt.Sprintf("体检完成：%d 个正常，%d 个两轮都打不开（已移到「%s」分组）：%s",
		alive, len(dead), target, strings.Join(names, "、"))
	if created {
		msg += fmt.Sprintf("\n已新建分组「%s」", target)
	}
	if skippedIntranet > 0 {
		msg += fmt.Sprintf("\n（%d 个内网地址按约定跳过未查；境外站从 NAS 直连探测可能有误差，建议你点开复核后再手动处理）", skippedIntranet)
	}
	return Result{Kind: "changed", Reply: msg, Changed: moved > 0 || created}, nil
}
