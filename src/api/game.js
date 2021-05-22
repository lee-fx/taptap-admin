import request from '@/utils/request'
export function fetchList(params) {
    return request({
        url: '/game/list',
        method: 'get',
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

export function updatePublishStatus(params) {
    return request({
        url: '/game/update/publishStatus',
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

