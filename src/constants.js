const BASE_URL = 'https://www.kofastools.com:3001';
const CLIENT_URL = 'http://www.kofastools.com:3000';
const URL = 'https://www.kofastools.com';

export default {
    BASE_URL,
    FLIP_TIME: 1500,
    PRE_SUMMON_TIME: 500,
    HOME: '/home',
    SUMMON: '/summon',
    PULL: '/pull/',
    BANNERS: '/banners',
    ADMIN: '/dashboard',
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',
    PRIVACY: '/privacy',
    TERMS: '/terms.html',
    TIER_LIST_MAKER: '/tiermaker',
    TIER_LISTS: '/tierlists',
    STATS: '/stats',
    TOPPULLS: '/top',
    SHARE_BASE_URL: URL + '/pull/',
    SHARE_BASE_TIER_URL: URL + '/tierlist/',
    SHARE_BASE_BANNER_URL: URL + '/summon/',
    TIER_LIST_LAYOUT: `/tiermaker/template/`,
    TIER_LIST: `/tierlist/`,
    DEFAULT_POOL_ID: '5e14a00f6a9c8e4d2034486d',
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
    DEFAULT_BANNER_IMAGE: `${CLIENT_URL}/images/banners/default.webp`
};
