const initialState = {
    poolId: 0
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_POOL_ID': {
            console.log('OPEN_DRAWER_DASHBOARD');
            return {
                ...state,
                poolId: action.poolId
            }
        }
        default:
            return {
                ...state
            }
    }
}

export default reducer;