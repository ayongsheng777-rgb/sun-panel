declare namespace DeskModule.SearchBox {

    interface SearchEngine  {
        iconSrc: string
        title: string
        url: string
        key?: string
        isDefault?: boolean
        sort?: number
    }

}

