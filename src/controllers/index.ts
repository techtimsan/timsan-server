export {
  registerUser,
  verifyEmail,
  getAllUsers,
  deleteUserById,
  getUserById,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resendVerificationEmail,
  resetPassword,
  emailVerified,
  assignAdminOrSuperAdmin,
} from "./auth.service";
export {
  createNewConference,
  getAllConference,
  getAllConferenceAttendee,
  registerForConference,
  deleteConferenceById,
} from "./conference.service";

export {
  //news
  createNewsPost,
  editNewsPost,
  deleteNewsPost,
  getNewsPostById,
  getAllNewsPosts,

  //broadcasts
  createBroadcast,
  editBroadcast,
  deleteBroadcast,
  getAllBroadcasts,
  getBroadcastById,

  //test
  // testingCloudUpload,
} from "./newsAndBroadcast.service";

export {
  getAllRedisData,
  getRedisDataById,
  deleteRedisUserDataById,
} from "./redis.service";

export {
  subscribeToNewsletter,
  getAllNewsletterSubscribers,
} from "./newsletter.service";
export { addInstitution, getAllInstitutions } from "./profile.service";
export { addNewBook, getAllBooks } from "./e-library.service";
export { addTiletCourse, getAllTiletCourses } from "./tilets.service";

// export{
// // nec

// createNECProfile,
// editNECProfile,
// getNECProfile,

// // zone

// createZoneProfile,
// editZoneProfile,
// getZoneProfile,

// // state

// createStateProfile,
// editStateProfile,
// getStateProfile,

// // institution

// createInstitutionProfile,
// editInstitutionProfile,
// getInstitutionProfile,

// // member

// createMemberProfile,
// editMemberProfile,
// getMemberProfile

// } from "./profile.service"
