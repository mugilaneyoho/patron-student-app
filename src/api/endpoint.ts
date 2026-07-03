export const HttpEndPoints = {
  dashboard: {
    get: '/institute/student/dashboard'
  },
  classes: {
    get: '/training/classes/student/:classtype',
    getZoomMeeting: (classId: string) => `/openvidu/zoom/meeting/${classId}`
  },
  attendance: {
    get: '/training/attendance/student'
  },
  student: {
    login: '/auth/students/login',
    resetpass: '/auth/students/reset-pass',
  },
  fees: {
    getAll: (uuid: string) => `/institute/student/${uuid}/fees`
  },
  notes: {
    getnotes: (id: number) => `/resources/notes/${id}`
  },
  notification: {
    getAll: '/notifylog/notification/user',
  },
  payment: {
    create: '/payment/razorpay/create-order',
    verify: '/payment/razorpay/verify',
  },
  profile: {
    getById: (uuid: string) => `/institute/student/${uuid}`,
    update: (uuid: string) => `/institute/student/${uuid}`
  },
  placement: {
    getAllInvite: "/placement/placement/invite-student",
    getInviteById: (id: string) => `/placement/placement/invite/${id}`,
    update: (id: string) => `/placement/placement/invite/${id}`,
  }
};
