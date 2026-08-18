package web

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

// Weather 天气结果（统一结构，屏蔽上游差异）
type Weather struct {
	City        string  `json:"city"`
	Temperature string  `json:"temperature"`  // 摄氏度
	FeelsLike   string  `json:"feelsLike"`    // 体感
	Condition   string  `json:"condition"`    // 天气现象
	Humidity    string  `json:"humidity"`     // 湿度 %
	Wind        string  `json:"wind"`         // 风速描述
	Forecast    []WFDay `json:"forecast"`     // 未来几天
	Source      string  `json:"source"`       // wttr.in / open-meteo
	UpdatedAt   string  `json:"updatedAt"`
}

// WFDay 单日预报
type WFDay struct {
	Date      string `json:"date"`
	MinTemp   string `json:"minTemp"`
	MaxTemp   string `json:"maxTemp"`
	Condition string `json:"condition"`
}

func httpGetJSON(rawURL string, timeout time.Duration, v any) error {
	if timeout <= 0 {
		timeout = 10 * time.Second
	}
	req, err := http.NewRequest(http.MethodGet, rawURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "curl/8.4.0") // wttr.in 对浏览器 UA 返回 HTML，对 curl UA 返回 JSON
	req.Header.Set("Accept", "application/json")
	client := &http.Client{Timeout: timeout}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("status %d: %s", resp.StatusCode, TruncateString(string(body), 200))
	}
	return json.Unmarshal(body, v)
}

// TruncateString 安全截断（按字符）
func TruncateString(s string, max int) string {
	r := []rune(s)
	if max <= 0 || len(r) <= max {
		return s
	}
	return string(r[:max]) + "…"
}

// GetWeather 查询天气：wttr.in 优先，失败降级 open-meteo。两者都免 API Key。
func GetWeather(city string) (Weather, error) {
	city = strings.TrimSpace(city)
	if city == "" {
		city = "Shanghai"
	}
	if w, err := weatherFromWttr(city); err == nil {
		return w, nil
	}
	return weatherFromOpenMeteo(city)
}

func weatherFromWttr(city string) (Weather, error) {
	var raw struct {
		CurrentCondition []struct {
			TempC      string `json:"temp_C"`
			FeelsLikeC string `json:"FeelsLikeC"`
			Humidity   string `json:"humidity"`
			WindKmph   string `json:"windspeedKmph"`
			WindDir    string `json:"winddir16Point"`
			LocalObs   string `json:"localObsDateTime"`
			WeatherDesc []struct {
				Value string `json:"value"`
			} `json:"weatherDesc"`
			Lang_zh []struct {
				Value string `json:"value"`
			} `json:"lang_zh"`
		} `json:"current_condition"`
		NearestArea []struct {
			AreaName []struct {
				Value string `json:"value"`
			} `json:"areaName"`
		} `json:"nearest_area"`
		Weather []struct {
			Date     string `json:"date"`
			MinTempC string `json:"mintempC"`
			MaxTempC string `json:"maxtempC"`
			Hourly   []struct {
				WeatherDesc []struct {
					Value string `json:"value"`
				} `json:"weatherDesc"`
				Lang_zh []struct {
					Value string `json:"value"`
				} `json:"lang_zh"`
			} `json:"hourly"`
		} `json:"weather"`
	}
	endpoint := "https://wttr.in/" + url.PathEscape(city) + "?format=j1&lang=zh"
	if err := httpGetJSON(endpoint, 12*time.Second, &raw); err != nil {
		return Weather{}, err
	}
	if len(raw.CurrentCondition) == 0 {
		return Weather{}, fmt.Errorf("wttr.in 无当前天气数据")
	}
	cur := raw.CurrentCondition[0]
	cond := ""
	if len(cur.Lang_zh) > 0 {
		cond = cur.Lang_zh[0].Value
	} else if len(cur.WeatherDesc) > 0 {
		cond = cur.WeatherDesc[0].Value
	}
	name := city
	if len(raw.NearestArea) > 0 && len(raw.NearestArea[0].AreaName) > 0 {
		name = raw.NearestArea[0].AreaName[0].Value
	}
	w := Weather{
		City:        name,
		Temperature: cur.TempC + "℃",
		FeelsLike:   cur.FeelsLikeC + "℃",
		Condition:   cond,
		Humidity:    cur.Humidity + "%",
		Wind:        cur.WindDir + " " + cur.WindKmph + "km/h",
		Source:      "wttr.in",
		UpdatedAt:   cur.LocalObs,
	}
	for i, d := range raw.Weather {
		if i >= 3 {
			break
		}
		dc := ""
		if len(d.Hourly) > 4 {
			h := d.Hourly[4]
			if len(h.Lang_zh) > 0 {
				dc = h.Lang_zh[0].Value
			} else if len(h.WeatherDesc) > 0 {
				dc = h.WeatherDesc[0].Value
			}
		}
		w.Forecast = append(w.Forecast, WFDay{Date: d.Date, MinTemp: d.MinTempC + "℃", MaxTemp: d.MaxTempC + "℃", Condition: dc})
	}
	return w, nil
}

// wmoCodeZh WMO 天气代码 → 中文
var wmoCodeZh = map[int]string{
	0: "晴", 1: "大部晴朗", 2: "多云", 3: "阴",
	45: "有雾", 48: "冻雾",
	51: "小毛毛雨", 53: "毛毛雨", 55: "大毛毛雨",
	61: "小雨", 63: "中雨", 65: "大雨",
	66: "冻雨", 67: "强冻雨",
	71: "小雪", 73: "中雪", 75: "大雪", 77: "雪粒",
	80: "阵雨", 81: "中阵雨", 82: "强阵雨",
	85: "阵雪", 86: "强阵雪",
	95: "雷阵雨", 96: "雷阵雨伴小冰雹", 99: "雷阵雨伴大冰雹",
}

func wmoDesc(code int) string {
	if v, ok := wmoCodeZh[code]; ok {
		return v
	}
	return "未知(" + strconv.Itoa(code) + ")"
}

func weatherFromOpenMeteo(city string) (Weather, error) {
	var geo struct {
		Results []struct {
			Name      string  `json:"name"`
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
			Country   string  `json:"country"`
		} `json:"results"`
	}
	geoURL := "https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&format=json&name=" + url.QueryEscape(city)
	if err := httpGetJSON(geoURL, 10*time.Second, &geo); err != nil {
		return Weather{}, err
	}
	if len(geo.Results) == 0 {
		return Weather{}, fmt.Errorf("找不到城市「%s」", city)
	}
	g := geo.Results[0]

	var fc struct {
		Current struct {
			Temperature float64 `json:"temperature_2m"`
			Humidity    float64 `json:"relative_humidity_2m"`
			Apparent    float64 `json:"apparent_temperature"`
			WeatherCode int     `json:"weather_code"`
			WindSpeed   float64 `json:"wind_speed_10m"`
			Time        string  `json:"time"`
		} `json:"current"`
		Daily struct {
			Time        []string  `json:"time"`
			TempMax     []float64 `json:"temperature_2m_max"`
			TempMin     []float64 `json:"temperature_2m_min"`
			WeatherCode []int     `json:"weather_code"`
		} `json:"daily"`
	}
	fcURL := fmt.Sprintf(
		"https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=auto",
		g.Latitude, g.Longitude)
	if err := httpGetJSON(fcURL, 12*time.Second, &fc); err != nil {
		return Weather{}, err
	}

	w := Weather{
		City:        g.Name,
		Temperature: fmt.Sprintf("%.1f℃", fc.Current.Temperature),
		FeelsLike:   fmt.Sprintf("%.1f℃", fc.Current.Apparent),
		Condition:   wmoDesc(fc.Current.WeatherCode),
		Humidity:    fmt.Sprintf("%.0f%%", fc.Current.Humidity),
		Wind:        fmt.Sprintf("%.1fkm/h", fc.Current.WindSpeed),
		Source:      "open-meteo",
		UpdatedAt:   fc.Current.Time,
	}
	for i := range fc.Daily.Time {
		if i >= 3 {
			break
		}
		day := WFDay{Date: fc.Daily.Time[i]}
		if i < len(fc.Daily.TempMin) {
			day.MinTemp = fmt.Sprintf("%.1f℃", fc.Daily.TempMin[i])
		}
		if i < len(fc.Daily.TempMax) {
			day.MaxTemp = fmt.Sprintf("%.1f℃", fc.Daily.TempMax[i])
		}
		if i < len(fc.Daily.WeatherCode) {
			day.Condition = wmoDesc(fc.Daily.WeatherCode[i])
		}
		w.Forecast = append(w.Forecast, day)
	}
	return w, nil
}

// ---------- 时间 ----------

var weekdayZh = [...]string{"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"}

// TimeInfo 时间结果
type TimeInfo struct {
	Timezone string `json:"timezone"`
	Datetime string `json:"datetime"`
	Date     string `json:"date"`
	Time     string `json:"time"`
	Weekday  string `json:"weekday"`
	Unix     int64  `json:"unix"`
}

// GetTime 取指定时区当前时间；tz 为空默认 Asia/Shanghai（容器无 tzdata 时降级 UTC+8 固定偏移）
func GetTime(tz string) TimeInfo {
	tz = strings.TrimSpace(tz)
	if tz == "" {
		tz = "Asia/Shanghai"
	}
	loc, err := time.LoadLocation(tz)
	if err != nil {
		loc = time.FixedZone("CST", 8*3600)
		tz = "UTC+8"
	}
	now := time.Now().In(loc)
	return TimeInfo{
		Timezone: tz,
		Datetime: now.Format("2006-01-02 15:04:05"),
		Date:     now.Format("2006-01-02"),
		Time:     now.Format("15:04:05"),
		Weekday:  weekdayZh[int(now.Weekday())],
		Unix:     now.Unix(),
	}
}
