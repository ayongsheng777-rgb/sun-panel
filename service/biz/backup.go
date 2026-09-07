package biz

import (
	"archive/zip"
	"encoding/json"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"sun-panel/global"
	"sun-panel/initialize/database"
	"sun-panel/lib/cmn"
	"sun-panel/models"
)

const (
	// BackupConfigVersion 备份包格式版本，格式不兼容时拒绝恢复。
	BackupConfigVersion = 1

	// BackupDir 备份 zip 的存放目录。
	BackupDir = "runtime/backup"
	// BackupTempDir 打包与解压的临时工作目录。
	BackupTempDir = "runtime/temp/backup"

	// CompatibilityOK 版本兼容
	CompatibilityOK = 1
	// CompatibilityMismatch 版本不兼容
	CompatibilityMismatch = 0
)

// BackupConfigPath 备份包内各部分的相对路径。
type BackupConfigPath struct {
	Uploads     string `json:"uploads"`
	CustomStyle string `json:"customStyle"`
	Sqlite      string `json:"sqlite"`
}

// BackupConfig 备份包描述文件（zip 内 config/backup.json）。
type BackupConfig struct {
	Name                  string           `json:"name"`
	ConfigVersion         int              `json:"configVersion"`
	SunPanelVersion       string           `json:"sunPanelVersion"`
	SunPanelLowestVersion string           `json:"sunPanelLowestVersion"`
	Time                  string           `json:"time"`
	Paths                 BackupConfigPath `json:"paths"`
}

// ErrBackupNotFound 备份文件不存在。
var ErrBackupNotFound = errors.New("backup file not found")

// currentVersion 当前程序版本号。
func currentVersion() string {
	return cmn.GetSysVersionInfo().Version
}

// DatabaseFilePath 当前数据库文件路径（仅 sqlite 有意义）。
func DatabaseFilePath() string {
	return global.Config.GetValueStringOrDefault("sqlite", "file_path")
}

// UploadsDir 上传文件目录。
func UploadsDir() string {
	return strings.TrimRight(global.Config.GetValueStringOrDefault("base", "source_path"), "/")
}

// buildConfig 生成备份描述信息。
func buildConfig(name string) BackupConfig {
	return BackupConfig{
		Name:                  name,
		ConfigVersion:         BackupConfigVersion,
		SunPanelVersion:       currentVersion(),
		SunPanelLowestVersion: "1.0.0",
		Time:                  time.Now().Format("2006-01-02 15:04:05"),
		Paths: BackupConfigPath{
			Uploads:     "uploads",
			CustomStyle: "custom",
			Sqlite:      "database/database.db",
		},
	}
}

// BackupToZip 打包成备份 zip，返回 zip 文件路径。
func BackupToZip() (string, error) {
	name := "sun-panel-backup-" + time.Now().Format("20060102-150405")
	workDir := filepath.Join(BackupTempDir, name)

	// 清理可能残留的旧目录，保证每次打包都是干净状态
	_ = os.RemoveAll(workDir)
	if err := os.MkdirAll(workDir, 0755); err != nil {
		return "", err
	}
	defer os.RemoveAll(workDir)

	// 1. 上传文件
	uploads := UploadsDir()
	if exist, _ := cmn.PathExists(uploads); exist {
		if err := copyDir(uploads, filepath.Join(workDir, "uploads")); err != nil {
			return "", err
		}
	}

	// 2. 自定义 CSS / JS
	if exist, _ := cmn.PathExists(CustomDir); exist {
		if err := copyDir(CustomDir, filepath.Join(workDir, "custom")); err != nil {
			return "", err
		}
	}

	// 3. 数据库
	if global.DB_DRIVER == database.SQLITE {
		dbFile := DatabaseFilePath()
		if exist, _ := cmn.PathExists(dbFile); exist {
			if err := copyFile(dbFile, filepath.Join(workDir, "database", "database.db")); err != nil {
				return "", err
			}
		}
	}

	// 4. 写描述文件
	configBytes, err := json.Marshal(buildConfig(name))
	if err != nil {
		return "", err
	}
	if err := os.MkdirAll(filepath.Join(workDir, "config"), 0755); err != nil {
		return "", err
	}
	if err := os.WriteFile(filepath.Join(workDir, "config", "backup.json"), configBytes, 0644); err != nil {
		return "", err
	}

	// 5. 压缩
	if err := os.MkdirAll(BackupDir, 0755); err != nil {
		return "", err
	}
	zipPath := filepath.Join(BackupDir, name+".zip")
	if err := backupPathToZip(workDir, zipPath); err != nil {
		return "", err
	}
	return zipPath, nil
}

// ListBackups 列出已有备份文件（按时间倒序）。
func ListBackups() ([]string, error) {
	if exist, _ := cmn.PathExists(BackupDir); !exist {
		return []string{}, nil
	}
	entries, err := os.ReadDir(BackupDir)
	if err != nil {
		return nil, err
	}
	names := []string{}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if strings.EqualFold(filepath.Ext(e.Name()), ".zip") {
			names = append(names, e.Name())
		}
	}
	// ReadDir 已按文件名升序，倒序后最新的排前面
	for i, j := 0, len(names)-1; i < j; i, j = i+1, j-1 {
		names[i], names[j] = names[j], names[i]
	}
	return names, nil
}

// RecoveryResp 恢复结果。
type RecoveryResp struct {
	CompatibilityStatus   int    `json:"compatibilityStatus"`
	LowestSunPanelVersion string `json:"lowestSunPanelVersion"`
	Message               string `json:"message"`
}

// VersionCompatibilityCheck 版本兼容检查。
func VersionCompatibilityCheck(cfg BackupConfig) (bool, string) {
	if cfg.ConfigVersion > BackupConfigVersion {
		return false, cfg.SunPanelLowestVersion
	}
	return true, cfg.SunPanelLowestVersion
}

// ExtractBackZip 解压备份包到工作目录，并读取描述文件。
func ExtractBackZip(zipPath string) (workDir string, cfg BackupConfig, err error) {
	if exist, _ := cmn.PathExists(zipPath); !exist {
		return "", cfg, ErrBackupNotFound
	}

	name := strings.TrimSuffix(filepath.Base(zipPath), filepath.Ext(zipPath))
	workDir = filepath.Join(BackupTempDir, "restore-"+name)
	_ = os.RemoveAll(workDir)
	if err = os.MkdirAll(workDir, 0755); err != nil {
		return
	}

	if err = unzip(zipPath, workDir); err != nil {
		return
	}

	cfg, err = loadBackupConfig(workDir)
	return
}

// loadBackupConfig 读取解压目录里的 config/backup.json。
func loadBackupConfig(workDir string) (BackupConfig, error) {
	cfg := BackupConfig{}
	raw, err := os.ReadFile(filepath.Join(workDir, "config", "backup.json"))
	if err != nil {
		return cfg, err
	}
	if err := json.Unmarshal(raw, &cfg); err != nil {
		return cfg, err
	}
	return cfg, nil
}

// Recovery 执行恢复：先还原文件，再替换数据库并重新建立连接。
func Recovery(fileName string, force bool) (RecoveryResp, error) {
	resp := RecoveryResp{}

	fileName = filepath.Base(fileName)
	if fileName == "" || strings.Contains(fileName, "..") {
		return resp, errors.New("invalid file name")
	}
	zipPath := filepath.Join(BackupDir, fileName)

	workDir, cfg, err := ExtractBackZip(zipPath)
	if err != nil {
		return resp, err
	}
	defer os.RemoveAll(workDir)

	ok, lowest := VersionCompatibilityCheck(cfg)
	resp.LowestSunPanelVersion = lowest
	if !ok {
		resp.CompatibilityStatus = CompatibilityMismatch
		resp.Message = "当前程序版本低于备份包要求，无法恢复"
		if !force {
			return resp, nil
		}
	} else {
		resp.CompatibilityStatus = CompatibilityOK
	}

	// 1. 还原上传文件
	srcUploads := filepath.Join(workDir, "uploads")
	if exist, _ := cmn.PathExists(srcUploads); exist {
		if err := copyDir(srcUploads, UploadsDir()); err != nil {
			return resp, err
		}
	}

	// 2. 还原自定义 CSS / JS
	srcCustom := filepath.Join(workDir, "custom")
	if exist, _ := cmn.PathExists(srcCustom); exist {
		if err := copyDir(srcCustom, CustomDir); err != nil {
			return resp, err
		}
	}

	// 3. 还原数据库
	srcDb := filepath.Join(workDir, "database", "database.db")
	if exist, _ := cmn.PathExists(srcDb); exist {
		if err := restoreDatabaseFile(srcDb); err != nil {
			return resp, err
		}
	}

	resp.Message = "恢复完成"
	return resp, nil
}

// restoreDatabaseFile 关闭当前连接 → 覆盖数据库文件 → 重新建立连接。
//
// 直接覆盖正在被打开的文件会导致后续读写错乱，所以这里先 Close 再覆盖再重连，
// 这样不需要重启进程就能让新数据生效。
func restoreDatabaseFile(srcDb string) error {
	if global.DB_DRIVER != database.SQLITE {
		return errors.New("当前数据库为 MySQL，暂不支持自动恢复，请手动导入 SQL")
	}

	targetDb := DatabaseFilePath()

	// 先把现有库留一份，万一恢复出问题还能回滚
	if exist, _ := cmn.PathExists(targetDb); exist {
		bakPath := targetDb + ".bak-" + time.Now().Format("20060102-150405")
		if err := copyFile(targetDb, bakPath); err != nil {
			return err
		}
	}

	// 断开连接
	if sqlDb, err := global.Db.DB(); err == nil {
		_ = sqlDb.Close()
	}

	if err := copyFile(srcDb, targetDb); err != nil {
		// 复制失败也要把连接恢复回去，避免服务不可用
		reopenDatabase()
		return err
	}

	return reopenDatabase()
}

// reopenDatabase 重新建立数据库连接并补建表结构。
func reopenDatabase() error {
	db, err := database.DbInit(&database.SQLiteConfig{Filename: DatabaseFilePath()})
	if err != nil {
		return err
	}
	global.Db = db
	models.Db = db

	if err := database.CreateDatabase(global.DB_DRIVER, db); err != nil {
		return err
	}

	// 系统设置缓存里还是旧值，清掉让它重新读库
	if global.SystemSetting != nil && global.SystemSetting.Cache != nil {
		global.SystemSetting.Cache.Flush()
	}
	return nil
}

// ---------- 文件与压缩工具 ----------

// copyFile 复制单个文件。
func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()

	if err := os.MkdirAll(filepath.Dir(dst), 0755); err != nil {
		return err
	}
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Sync()
}

// copyDir 递归复制目录，已存在的同名文件会被覆盖。
func copyDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}
		target := filepath.Join(dst, rel)

		if info.IsDir() {
			return os.MkdirAll(target, 0755)
		}
		return copyFile(path, target)
	})
}

// backupPathToZip 把整个目录压成 zip。
func backupPathToZip(srcDir, zipPath string) error {
	if err := os.MkdirAll(filepath.Dir(zipPath), 0755); err != nil {
		return err
	}

	zipFile, err := os.Create(zipPath)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	writer := zip.NewWriter(zipFile)
	defer writer.Close()

	return filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		rel, err := filepath.Rel(srcDir, path)
		if err != nil {
			return err
		}
		// zip 内统一用斜杠分隔
		rel = filepath.ToSlash(rel)

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = rel
		header.Method = zip.Deflate

		entry, err := writer.CreateHeader(header)
		if err != nil {
			return err
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		_, err = io.Copy(entry, file)
		return err
	})
}

// unzip 解压，含 Zip Slip 防护：拒绝绝对路径与 ../ 逃逸。
func unzip(zipPath, destDir string) error {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return err
	}
	defer reader.Close()

	destAbs, err := filepath.Abs(destDir)
	if err != nil {
		return err
	}

	for _, f := range reader.File {
		name := filepath.ToSlash(f.Name)
		if strings.HasPrefix(name, "/") || strings.Contains(name, "..") {
			// 绝对路径或包含上级目录引用，直接跳过，防止写出到目标目录之外
			continue
		}

		target := filepath.Join(destAbs, filepath.FromSlash(name))
		targetAbs, err := filepath.Abs(target)
		if err != nil {
			return err
		}
		if targetAbs != destAbs && !strings.HasPrefix(targetAbs, destAbs+string(os.PathSeparator)) {
			continue
		}

		if f.FileInfo().IsDir() {
			if err := os.MkdirAll(targetAbs, 0755); err != nil {
				return err
			}
			continue
		}

		if err := os.MkdirAll(filepath.Dir(targetAbs), 0755); err != nil {
			return err
		}
		if err := extractOneFile(f, targetAbs); err != nil {
			return err
		}
	}
	return nil
}

// extractOneFile 解压单个文件条目。
func extractOneFile(f *zip.File, target string) error {
	src, err := f.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.OpenFile(target, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	return err
}
