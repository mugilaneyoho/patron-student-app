import { HttpEndPoints } from './endpoint';
import httpclient from './httpclient';

class Client {
  student = {
    login: (data: { email: string; password: string }) => httpclient.post(HttpEndPoints.student.login, data),
    restpass: (data: { password: string; token: string }) => httpclient.put(HttpEndPoints.student.resetpass, data)
  };

  classes = {
    get: (classtype: string) => httpclient.get(HttpEndPoints.classes.get.replace(':classtype', classtype))
  };

  dashboard = {
    get: () => httpclient.get(HttpEndPoints.dashboard.get),
  };

  fees = {
    GetAll: (uuid: string) => httpclient.get(HttpEndPoints.fees.getAll(uuid))
  };

  attendance = {
    get: (data: { date: string }) => httpclient.get(HttpEndPoints.attendance.get, data)
  };

  notes = {
    getById: (id: number) => httpclient.get(HttpEndPoints.notes.getnotes(id))
  };

  notification = {
    getAll: () => httpclient.get(HttpEndPoints.notification.getAll),
  };

  payment = {
    create: (data: any) => httpclient.post(HttpEndPoints.payment.create, data),
    verify: (data: any) => httpclient.post(HttpEndPoints.payment.verify, data),
  };

  profile = {
    getById: (uuid: string) => httpclient.get(HttpEndPoints.profile.getById(uuid)),
    update: (uuid: string, data: any) => httpclient.put(HttpEndPoints.profile.update(uuid), data)
  };

  placement = {
    getAllInvite: () => httpclient.get(HttpEndPoints.placement.getAllInvite),
    getInviteById: (id: string) => httpclient.get(HttpEndPoints.placement.getInviteById(id)),
    update: (id: string, data: any) => httpclient.patch(HttpEndPoints.placement.update(id), data)
  }
}

export default new Client();
