// Package docker 通过 Docker Engine 的 HTTP API 操作本机容器。
//
// 这里刻意不引入 github.com/docker/docker 官方 SDK：
// 官方 SDK 依赖树很大，而本功能只需要"列容器 / 查状态 / 启停重启"四个动作，
// 直接用 Unix 套接字发 HTTP 请求即可，零新增依赖、编译更快、出错也更好排查。
package docker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"strings"
	"time"
)

// DefaultSocketPath Docker 守护进程默认监听的 Unix 套接字。
const DefaultSocketPath = "/var/run/docker.sock"

// ErrDaemonUnavailable Docker 守护进程不可达（没挂套接字、非 Docker 环境部署等）。
var ErrDaemonUnavailable = errors.New("docker daemon unavailable")

// 允许前端触发的动作白名单，杜绝任意命令执行。
var allowedActions = map[string]string{
	"start":   "start",
	"stop":    "stop",
	"restart": "restart",
}

// Client 封装到 Docker 守护进程的连接。
type Client struct {
	socketPath string
	httpClient *http.Client
}

// NewClient 创建客户端，socketPath 为空时使用默认路径。
func NewClient(socketPath string) *Client {
	socketPath = strings.TrimSpace(socketPath)
	if socketPath == "" {
		socketPath = DefaultSocketPath
	}

	return &Client{
		socketPath: socketPath,
		httpClient: &http.Client{
			Transport: &http.Transport{
				DialContext: func(ctx context.Context, _ string, _ string) (net.Conn, error) {
					var d net.Dialer
					return d.DialContext(ctx, "unix", socketPath)
				},
			},
			Timeout: 20 * time.Second,
		},
	}
}

// Ping 检测守护进程是否可达，返回 nil 表示可用。
func (c *Client) Ping() error {
	conn, err := net.DialTimeout("unix", c.socketPath, 3*time.Second)
	if err != nil {
		return ErrDaemonUnavailable
	}
	_ = conn.Close()
	return nil
}

// do 向 Docker Engine API 发一个请求，method 为 GET/POST，result 可为 nil。
func (c *Client) do(method, apiPath string, result interface{}) error {
	req, err := http.NewRequest(method, "http://docker"+apiPath, nil)
	if err != nil {
		return err
	}
	req.Host = "docker"

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return ErrDaemonUnavailable
	}
	defer resp.Body.Close()

	body := make([]byte, 0)
	buf := make([]byte, 4096)
	for {
		n, readErr := resp.Body.Read(buf)
		if n > 0 {
			body = append(body, buf[:n]...)
		}
		if readErr != nil {
			break
		}
	}

	if resp.StatusCode >= 400 {
		message := strings.TrimSpace(string(body))
		if message == "" {
			message = resp.Status
		}
		return fmt.Errorf("docker api error: %s", message)
	}

	if result == nil || len(body) == 0 {
		return nil
	}
	return json.Unmarshal(body, result)
}

// PortMapping 容器端口映射。
type PortMapping struct {
	IP          string `json:"ip"`
	PrivatePort int    `json:"privatePort"`
	PublicPort  int    `json:"publicPort"`
	Type        string `json:"type"`
}

// ContainerInfo 列表接口返回的容器摘要信息。
type ContainerInfo struct {
	Id     string        `json:"id"`
	Name   string        `json:"name"`
	Image  string        `json:"image"`
	State  string        `json:"state"`
	Status string        `json:"status"`
	Ports  []PortMapping `json:"ports"`
}

type dockerContainerItem struct {
	Id     string `json:"Id"`
	Names  []string
	Image  string `json:"Image"`
	State  string `json:"State"`
	Status string `json:"Status"`
	Ports  []struct {
		IP          string `json:"IP"`
		PrivatePort int    `json:"PrivatePort"`
		PublicPort  int    `json:"PublicPort"`
		Type        string `json:"Type"`
	} `json:"Ports"`
}

// ListContainers 列出容器，all 为 true 时包含已停止的容器。
func (c *Client) ListContainers(all bool) ([]ContainerInfo, error) {
	apiPath := "/containers/json?all=0"
	if all {
		apiPath = "/containers/json?all=1"
	}

	raw := []dockerContainerItem{}
	if err := c.do("GET", apiPath, &raw); err != nil {
		return nil, err
	}

	list := make([]ContainerInfo, 0, len(raw))
	for _, item := range raw {
		ports := make([]PortMapping, 0, len(item.Ports))
		for _, p := range item.Ports {
			ports = append(ports, PortMapping{
				IP:          p.IP,
				PrivatePort: p.PrivatePort,
				PublicPort:  p.PublicPort,
				Type:        p.Type,
			})
		}

		list = append(list, ContainerInfo{
			Id:     item.Id,
			Name:   trimContainerName(item.Names),
			Image:  item.Image,
			State:  item.State,
			Status: item.Status,
			Ports:  ports,
		})
	}
	return list, nil
}

// GetContainerState 查询单个容器的运行状态（running / exited / paused 等）。
func (c *Client) GetContainerState(containerId string) (ContainerInfo, error) {
	info := ContainerInfo{}
	if strings.TrimSpace(containerId) == "" {
		return info, errors.New("container id is empty")
	}

	raw := struct {
		Id    string `json:"Id"`
		Name  string `json:"Name"`
		State struct {
			Status string `json:"Status"`
		} `json:"State"`
	}{}

	if err := c.do("GET", "/containers/"+containerId+"/json", &raw); err != nil {
		return info, err
	}

	info.Id = raw.Id
	info.Name = strings.TrimPrefix(raw.Name, "/")
	info.State = raw.State.Status
	return info, nil
}

// GetContainerIDByName 按容器名查询容器 ID。
func (c *Client) GetContainerIDByName(name string) (string, error) {
	name = strings.TrimSpace(strings.TrimPrefix(name, "/"))
	if name == "" {
		return "", errors.New("container name is empty")
	}

	list, err := c.ListContainers(true)
	if err != nil {
		return "", err
	}
	for _, item := range list {
		if item.Name == name {
			return item.Id, nil
		}
	}
	return "", errors.New("container not found")
}

// ExecAction 对容器执行白名单内的动作：start / stop / restart。
func (c *Client) ExecAction(containerId, action string) error {
	containerId = strings.TrimSpace(containerId)
	if containerId == "" {
		return errors.New("container id is empty")
	}

	realAction, ok := allowedActions[strings.ToLower(strings.TrimSpace(action))]
	if !ok {
		return errors.New("unsupported action")
	}

	return c.do("POST", "/containers/"+containerId+"/"+realAction, nil)
}

// trimContainerName Docker 返回的名字形如 "/nginx"，去掉开头的斜杠。
func trimContainerName(names []string) string {
	if len(names) == 0 {
		return ""
	}
	return strings.TrimPrefix(names[0], "/")
}
