import client from '../../../api/index'

export const getNotificaitionService = async () => {
    const res = await client.notification.getAll()
    return res?.data ?? []
}