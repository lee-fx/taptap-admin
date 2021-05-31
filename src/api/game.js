import request from '@/utils/request'

// 获取游戏列表
export function fetchList(params) {
    return request({
        url: '/game/list',
        method: 'get',
        params: params
    })
}

// 获取tages
export function gameTags() {
    return request({
        url: '/game/gameTag',
        method: 'get',
        params: []
    })
}

// 获取游戏标签列表
export function gameTagListByGameId(params) {
    return request({
        url: '/game/gameTagByGameId',
        method: 'get',
        params: params
    })
}

// 获取游戏列表


// 修改游戏标签
export function updateGameTagList(id, data) {
    return request({
        url: '/game/update/gameTag/' + id,
        method: 'post',
        data: data
    })
}

// 修改游戏状态
export function updateGameStatus(params) {
    return request({
        url: '/game/update/gameStatus',
        method: 'post',
        params: params
    })
}
 



export function fetchSimpleList(params) {
    return request({
        url: '/game/simpleList',
        method: 'get',
        params: params
    })
}

export function updateDeleteStatus(params) {
    return request({
        url: '/game/update/deleteStatus',
        method: 'post',
        params: params
    })
}

export function updateNewStatus(params) {
    return request({
        url: '/game/update/newStatus',
        method: 'post',
        params: params
    })
}

export function updateRecommendStatus(params) {
    return request({
        url: '/game/update/recommendStatus',
        method: 'post',
        params: params
    })
}

export function createGame(data) {
    return request({
        url: '/game/create',
        method: 'post',
        data: data
    })
}

export function updateGame(id, data) {
    return request({
        url: '/game/update/' + id,
        method: 'post',
        data: data
    })
}

export function getGame(id) {
    return request({
        url: '/game/updateInfo/' + id,
        method: 'get',
    })
}

