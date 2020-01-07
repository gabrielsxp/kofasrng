import moment from 'moment';

const initialState = {
    user: null,
    currentDashboardItem: 0,
    fromDate: moment(),
    toDate: moment()
}

const reducer = (state = { ...initialState }, action) => {
    switch (action.type) {
        case 'AUTHENTICATED_USER': {
            return {
                ...state,
                user: action.user
            }
        }
        case 'CURRENT_DASHBOARD_ITEM': {
            return {
                ...state,
                currentDashboardItem: action.item
            }
        }
        case 'BANNER_START_DATE': {
            return {
                ...state,
                fromDate: moment(action.fromDate)
            }
        }
        case 'BANNER_END_DATE': {
            return {
                ...state,
                toDate: moment(action.toDate)
            }
        }
        default:
            return {
                ...state
            }
    }
}

export default reducer;