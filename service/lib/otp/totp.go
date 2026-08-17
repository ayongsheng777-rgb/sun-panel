package otp

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"encoding/base32"
	"encoding/binary"
	"fmt"
	"net/url"
	"strings"
	"sync"
	"time"
)

// timeStep TOTP 时间步长（秒），标准 30 秒
const timeStep = 30

// bindTokens 首次绑定 OTP 时签发的临时 token（内存态，重启即失效）
var bindTokens sync.Map // bindToken(string) -> userId(uint)

// GenerateSecret 生成新的 base32 密钥（20 字节）
func GenerateSecret() string {
	b := make([]byte, 20)
	if _, err := rand.Read(b); err != nil {
		// 极端情况下退化为时间熵
		for i := range b {
			b[i] = byte(time.Now().Nanosecond() + i)
		}
	}
	return base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(b)
}

// computeTOTP 计算指定时刻的 TOTP 码（6 位）
func computeTOTP(secret string, t time.Time) string {
	secret = strings.ToUpper(strings.TrimSpace(secret))
	decoded, err := base32.StdEncoding.WithPadding(base32.NoPadding).DecodeString(secret)
	if err != nil {
		decoded, err = base32.StdEncoding.DecodeString(secret)
		if err != nil {
			return ""
		}
	}
	counter := uint64(t.Unix() / timeStep)
	buf := make([]byte, 8)
	binary.BigEndian.PutUint64(buf, counter)
	mac := hmac.New(sha1.New, decoded)
	mac.Write(buf)
	sum := mac.Sum(nil)
	offset := sum[len(sum)-1] & 0x0f
	code := binary.BigEndian.Uint32(sum[offset:offset+4]) & 0x7fffffff
	code = code % 1000000
	return fmt.Sprintf("%06d", code)
}

// GenerateTOTP 计算当前时刻的 TOTP 码
func GenerateTOTP(secret string) string {
	return computeTOTP(secret, time.Now())
}

// VerifyTOTP 校验动态码，允许 ±1 个时间窗口（时钟抖动容错）
func VerifyTOTP(secret string, code string, t time.Time) bool {
	code = strings.TrimSpace(code)
	if len(code) != 6 {
		return false
	}
	for _, tm := range []time.Time{
		t.Add(-timeStep * time.Second),
		t,
		t.Add(timeStep * time.Second),
	} {
		if computeTOTP(secret, tm) == code {
			return true
		}
	}
	return false
}

// BuildOtpAuthURL 生成 otpauth:// URI，供 Google/Microsoft Authenticator 扫码
func BuildOtpAuthURL(issuer, account, secret string) string {
	secret = strings.ToUpper(strings.TrimSpace(secret))
	label := url.QueryEscape(issuer + ":" + account)
	q := url.Values{}
	q.Set("secret", secret)
	q.Set("issuer", issuer)
	q.Set("algorithm", "SHA1")
	q.Set("digits", "6")
	q.Set("period", "30")
	return "otpauth://totp/" + label + "?" + q.Encode()
}

// IssueBindToken 签发绑定临时 token，映射到用户
func IssueBindToken(userId uint) string {
	token := fmt.Sprintf("%d-%d", userId, time.Now().UnixNano())
	bindTokens.Store(token, userId)
	return token
}

// ConsumeBindToken 消费绑定 token，返回用户 ID（仅一次有效）
func ConsumeBindToken(token string) (uint, bool) {
	if v, ok := bindTokens.Load(token); ok {
		bindTokens.Delete(token)
		return v.(uint), true
	}
	return 0, false
}
