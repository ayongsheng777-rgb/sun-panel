package models

// AiOperationLog AI/用户操作审计日志（初版规格书第 15 章）
type AiOperationLog struct {
	BaseModel
	UserId     uint   `gorm:"index" json:"userId"`
	Operator   string `gorm:"type:varchar(20)" json:"operator"`   // AI / User
	Action     string `gorm:"type:varchar(50)" json:"action"`     // add / edit / move_group / change_icon / sort ...
	Target     string `gorm:"type:varchar(255)" json:"target"`    // 目标描述，如「新增网址 ChatGPT」
	BeforeData string `gorm:"type:text" json:"beforeData"`        // 变更前数据 JSON
	AfterData  string `gorm:"type:text" json:"afterData"`         // 变更后数据 JSON
}
