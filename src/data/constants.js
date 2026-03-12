export const Categories = [
    {text:"跨年", value: "跨年"},
    {text:"觀星", value: "觀星"},
    {text:"運動", value: "運動"},
    {text:"美食", value: "美食"},
    {text:"攀岩", value: "攀岩"},
    {text:"日出", value: "日出"},
    {text:"攝影", value: "攝影"},
    {text:"親子", value:"親子"},
    {text:"露營", value:"露營"},
    {text:"海洋", value:"海洋"},
];

export const Transports = [
    {text:"團主開車", value: "團主開車"},
    {text:"自駕自乘", value: "自駕自乘"},
    {text:"自行前往", value:"自行前往"},
    {text:"大眾交通", value:"大眾交通"},
    {text:"專人接送", value:"專人接送"},
]

export const Regions = {
    '北部': [
        { text: '台北市', value: '台北市' },
        { text: '新北市', value: '新北市' },
        { text: '基隆市', value: '基隆市' },
        { text: '宜蘭縣', value: '宜蘭縣' },
        { text: '桃園市', value: '桃園市' },
        { text: '新竹縣', value: '新竹縣' },
        { text: '新竹市', value: '新竹市' }
    ],
    '中部': [
        { text: '苗栗縣', value: '苗栗縣' },
        { text: '彰化縣', value: '彰化縣' },
        { text: '南投縣', value: '南投縣' },
        { text: '雲林縣', value: '雲林縣' },
        { text: '台中市', value: '台中市' }
    ],
    '南部': [
        { text: '嘉義縣', value: '嘉義縣' },
        { text: '嘉義市', value: '嘉義市' },
        { text: '台南市', value: '台南市' },
        { text: '高雄市', value: '高雄市' },
        { text: '屏東縣', value: '屏東縣' }
    ],
    '東部': [
        { text: '花蓮縣', value: '花蓮縣' },
        { text: '台東縣', value: '台東縣' }
    ],
    '外島': [
        { text: '澎湖縣', value: '澎湖縣' },
        { text: '金門縣', value: '金門縣' },
        { text: '連江縣', value: '連江縣' }
    ],
};

export const SortType = [
    {text: '熱門開團', value: '熱門開團', sort: 'views', order: 'desc'},
    {text: '依截止時間', value: '依截止時間', sort: 'deadline', order: 'asc'},
    {text: '依出發時間', value: '依出發時間', sort: 'start_date', order: 'asc'},
    {text: '團主評價', value: '團主評價', sort: 'host_rating', order: 'desc'},
];
