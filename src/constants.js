const BASE_URL = 'https://api.kofastools.com';
const CLIENT_URL = 'https://www.kofastools.com';
const URL = 'https://www.kofastools.com';
/*
    Local environment
    const BASE_URL = 'http://localhost:3001';
    const CLIENT_URL = 'http://localhost:3000';
    const URL = 'http://localhost:3000';

    Production environment
    const BASE_URL = 'https://api.kofastools.com';
    const CLIENT_URL = 'https://www.kofastools.com';
    const URL = 'https://www.kofastools.com';
*/

export default {
    BASE_URL,
    CLIENT_URL,
    FLIP_TIME: 1500,
    PRE_SUMMON_TIME: 500,
    NUMBER_OF_SUMMONS_ON_TOP: 6,
    HOME: '/home',
    SUMMON: '/summon',
    PULL: '/pull/',
    BANNERS: '/banners',
    ADMIN: '/dashboard',
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',
    RECOVERY: '/recovery',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    TIER_LIST_MAKER: '/tiermaker',
    TIER_LISTS: '/tierlists',
    STATS: '/stats',
    TOPPULLS: '/top',
    SHARE_BASE_URL: URL + '/pull/',
    SHARE_BASE_TIER_URL: URL + '/tierlist/',
    SHARE_BASE_BANNER_URL: URL + '/summon/',
    TIER_LIST_LAYOUT: `/tiermaker/template/`,
    TIER_LIST: `/tierlist/`,
    DEFAULT_POOL_ID: '5e2217e19198a800138046af', //local '5e14a00f6a9c8e4d2034486d'//production '5e2216089198a800138046aa'
    CREATE_POOL: `/pool`,
    FIGHTERS_REQUEST: '/fighters',
    FIGHTERS_INDEX: 0,
    SELECTED_FIGHTERS_INDEX: 1,
    CREATE_POOL_SAVE_CHANGES_INDEX: 2,
    FIGHTER_URL: `${CLIENT_URL}/images/fighters/`,
    BANNER_URL: `${CLIENT_URL}/images/banners/`,
    OTHERS_URL: `${CLIENT_URL}/images/others/`,
    ATTACK_URL: `${CLIENT_URL}/images/others/Attack_circle.webp`,
    DEFENSE_URL: `${CLIENT_URL}/images/others/Defense_circle.webp`,
    GOLD_URL: `${CLIENT_URL}/images/others/5stars_mini.webp`,
    SILVER_URL: `${CLIENT_URL}/images/others/4stars_mini.webp`,
    BRONZE_URL: `${CLIENT_URL}/images/others/3stars_mini.webp`,
    TECH_URL: `${CLIENT_URL}/images/others/Tech_circle.webp`,
    PURPLE_URL: `${CLIENT_URL}/images/others/Purple_circle.webp`,
    BLUE_URL: `${CLIENT_URL}/images/others/Blue_circle.webp`,
    RED_URL: `${CLIENT_URL}/images/others/Red_circle.webp`,
    GREEN_URL: `${CLIENT_URL}/images/others/Green_circle.webp`,
    YELLOW_URL: `${CLIENT_URL}/images/others/Yellow_circle.webp`,
    DEFAULT_BANNER_IMAGE: `${CLIENT_URL}/images/banners/default.webp`,
    YEARS: `${CLIENT_URL}/images/years`
};
