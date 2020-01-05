const initialState = {
    user: null,
    currentDashboardItem: 0,
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
            console.log(action.item);   
            return {
                ...state,
                currentDashboardItem: action.item
            }
        }
        default:
            console.log('wrong');
            return {
                ...state
            }
    }
}

export default reducer;