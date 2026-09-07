package models

type File struct {
	BaseModel
	Src      string `json:"src"`
	UserId   uint   `json:"userId"`
	FileName string `json:"fileName" gorm:"varchar(255)"` // 文件名
	Method   int    `gorm:"int(5)" json:"method"`         // 上传方式
	Ext      string `gorm:"varchar(255)" json:"ext"`      // 扩展名
	// Type 文件用途：1 壁纸 2 图标。0 视为未分类（历史数据）
	Type int `gorm:"int(5);default:0" json:"type"`
	// IsPublicGallery 是否属于公共图库。公共图库对所有账号可见，私有图库仅上传者可见
	IsPublicGallery bool `gorm:"default:false" json:"isPublicGallery"`
}

// 添加一个文件记录
func (m *File) AddFile(userId uint, fileName, ext, src string) (File, error) {
	file := File{
		UserId:   userId,
		FileName: fileName,
		Src:      src,
		Ext:      ext,
	}
	err := Db.Create(&file).Error

	return file, err
}
