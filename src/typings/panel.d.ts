declare namespace Panel {

    interface Info extends ItemInfo {

    }

    // 地址类型
    type ItemAddressType = 'https' | 'http' | 'lan' | 'other'

    // 弹性多地址：一个图标 = 1 个默认地址 + N 个可选地址
    interface ItemAddress {
        id: string
        name: string
        url: string
        type: ItemAddressType
        isDefault: boolean
        sort: number
        enabled: boolean
        openMethod?: number
        color?: string
    }

    interface ItemInfo extends Common.InfoBase {
        icon: ItemIcon |null
        title: string
        url: string
        sort?: number
        lanUrl?: string
        description?: string
        openMethod: number
        itemIconGroupId ?:number
        // 新版弹性地址集合（优先使用）
        addresses?: Panel.ItemAddress[]
    }

    interface ItemIconGroup extends Common.InfoBase {
        icon?: string
        title?: string
        sort?:number
    }

    interface ItemIcon {
        itemType: number
        src ?: string
        text ?: string
        // bgColor ?: string
        backgroundColor ?: string
    }

    interface State {
        rightSiderCollapsed: boolean
        leftSiderCollapsed: boolean
        networkMode:PanelStateNetworkModeEnum | null
        panelConfig:panelConfig
    }

    interface panelConfig{
        backgroundImageSrc?:string
        backgroundBlur?:number
        backgroundMaskNumber?:number
        iconStyle?:PanelPanelConfigStyleEnum
        iconTextColor?:string
        iconTextInfoHideDescription?:boolean
        iconTextIconHideTitle?:boolean
        logoText?:string
        logoImageSrc?:string
        clockShowSecond?:boolean
        clockColor?:string
        searchBoxShow?:boolean
        searchBoxSearchIcon?:boolean
        marginTop?:number
        marginBottom?:number
        maxWidth?:number
        maxWidthUnit:string
        marginX?:number
        footerHtml?:string
        systemMonitorShow?:boolean
        systemMonitorShowTitle?:boolean
        systemMonitorPublicVisitModeShow?:boolean
        netModeChangeButtonShow?:boolean
    }

    interface userConfig{
        panel:panelConfig
        searchEngine?:any
    }

    interface ItemIconSortRequest{
        sortItems:Common.SortItemRequest[]
        itemIconGroupId:number
    }

    // ===== AI 智能搜索 =====
    type AISearchMode = 'normal' | 'ai'

    interface AISearchResponse {
        mode: string
        query: string
        results: Panel.ItemInfo[]
        count: number
        provider?: string
        model?: string
        fallback?: boolean
        reason?: string
    }

    interface AIModel {
        id: string
        name?: string
        provider: string
        contextLength?: number
        available?: boolean
    }

    interface AIProviderConfig {
        provider: 'openai' | 'deepseek' | 'nvidia' | 'gemini' | 'custom'
        baseUrl: string
        apiKey: string
        model: string
        enabled: boolean
        timeout: number
        temperature?: number
        maxTokens?: number
        extraHeaders?: Record<string, string>
        thinking?: 'off' | 'low' | 'medium' | 'high' // 思考模式（推理模型生效）
    }

    interface AIConfig {
        enabled: boolean
        defaultProvider: 'openai' | 'deepseek' | 'nvidia' | 'gemini' | 'custom'
        backupProvider?: 'openai' | 'deepseek' | 'nvidia' | 'gemini' | 'custom' | ''
        strategy: string
        providers: Record<string, AIProviderConfig>
    }

    interface AIModelTestResult {
        model: string
        success: boolean
        latencyMs: number
        firstTokenMs?: number
        totalMs?: number
        error?: string
        testedAt: string
    }
}

