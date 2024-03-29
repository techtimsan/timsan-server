import { INSTITUTIONS, User, Zone } from "@prisma/client"

declare global {
  namespace Express {
    interface Request {
      user?: User
      file?: FileUploadFormat
    }
  }
}

export interface FileUploadFormat {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  path: string;
}

export type SendActivationCodeMailOptions = {
  emailAddress: string
  subject: string
  template: string
  data: { [key: string]: any }
}

export type RegisterUserData = {
  firstName: string
  lastName: string
  email: string
  password: string
  accountType: "MEMBER" | "INSTITUTION" | "STATE" | "ZONAL" | "NEC"
}

export type LoginUserData = {
  email: string
  password: string
}

export type ExcoProfileData = {
  firstName: string
  lastName: string
  otherNames?: string
  email: string
  phoneNumber: string
  avatarUrl: string
  courseOfStudy: string
  post: string
  occupation: string
  graduationStatus: "GRADUATE" | "UNDER_GRADUATE" | "POST_GRADUATE"
  graduationDate: Date
  stateOfOrigin: string
  stateOfResidence: string
}

export type AuthTokenOptions = {
  expires: Date
  maxAge: number
  httpOnly: boolean
  sameSite: "lax" | "strict" | "none" | undefined
  secure?: boolean
}

export type JWTSignOptions = {
  expiresIn?: string | number
}

export type MemberProfileData = {
  firstName: string
  lastName: string
  otherNames?: string
  bio: string
  phoneNumber: string
  email: string
  avatarUrl?: string
  institution: string
  gender: "MALE" | "FEMALE"
  course: string
  occupation: string
  graduationStatus: "GRADUATE" | "UNDER_GRADUATE" | "POST_GRADUATE"
  graduationDate: Date
  stateOfOrigin: string
  stateOfResidence: string
  institutionProfileId: string
}

export type InstitutionProfileData = {
  acronym: string
  address: string
  lat: number
  long: number
  state: string
  zone:  "SOUTH_WEST"| "NORTH_WEST" | "NORTH_CENTRAL" | "NORTH_EAST"
  email: string
  phoneNumber: string
  avatarUrl?: string
  stateProfileId: string
  institutionName: "UNIVERSITY_OF_ABUJA"|"FEDERAL_COLLEGE_OF_EDUCATION_ZUBA"|"KOGI_STATE_UNIVERSITY"|"KOGI_STATE_POLYTECHNIC"|"FEDERAL_UNIVERSITY_LOKOGA"|"FEDERAL_POLYTECHNIC_IDAH"|"COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_IDAH"|"UNIVERSITY_OF_ILORIN"|"KWARA_STATE_UNIVERSITY_MOLETE"|"COLLEGE_OF_EDUCATION_ILORIN"|"COLLEGE_OF_EDUCATION_ORO"|"FEDERAL_POLYTECHNIC_OFFA"|"KWARA_STATE_POLYTECHNIC_ILORIN"|"KWARA_STATE_COLLEGE_OF_HEALTH_TECHNOLOGY_OFFA"|"COLLEGE_OF_EDUCATION_LAFIA_AJI"|"FEDERAL_UNIVERSITY_LAFIA"|"FEDERAL_POLYTECHNIC_NASSARAWA"|"COLLEGE_OF_AGRICULTURE_LAFIA"|"SCHOOL_OF_HEALTH_KEFFI"|"COLLEGE_OF_EDUCATION_AKWANGA"|"NASSARAWA_STATE_UNIVERSITY_KEFFI"|"ISA_MUSTAPHA_AGWAEI_POLYTECHNIC_LAFIA"|"FEDERAL_UNIVERSITY_OF_TECHNOLOGY_MINNA"|"IBRAHIM_BADAMASI_BABANGIDA_UNIVERSITY_LAPAI"|"FCE_KONTONGORA"|"MODIBBO_ADAMA_UNIVERSITY_OF_TECHNOLOGY_YOLA"|"FCE_YOLA"|"COLLEGE_FOR_LEGAL_STUDIES_YOLA"|"ADAMAWA_STATE_UNIVERSITY_MUBI"|"ADAMAWA_STATE_POLYTECHNIC_YOLA"|"FEDERAL_POLY_MUBI"|"COLLEGE_OF_AGRIC_GANYE"|"COLLEGE_OF_HEALTH_TECH_MUBI"|"KANZUL_ISLAM_ACADEMY_YOLA"|"SCHOOL_FOR_ARABIC_AND_ISLAMIC_STUDIES_YOLA"|"ABUBAKAR_TAFAWA_BALEWA_UNIVERSITY"|"BAUCHI_STATE_UNIVERSITY_GADAU"|"BILL_AND_MELINDA_COLLEGE_OF_HEALTH_TECHNOLOGY_NINGI"|"AMINU_SALE_COLLEGE_OF_EDUCATION_AZARE"|"AD_RUFAI_COLLEGE_OF_EDUCATION"|"LEGAL_AND_GENERAL_STUDIES_MISAU"|"ADAMU_TAFAWA_BALEWA_COLLEGE_OF_EDUCATION_KANGERE"|"BILYAMINU_USMAN_COLLEGE_OF_EDUCATION_DASS"|"COLLEGE_OF_AGRICULTURE_BAUCHI"|"UNIVERSITY_OF_MAIDUGURI"|"RAMAT_POLYTECHNIC"|"KASHIM_IBRAHIM_COLLEGE_OF_EDUCATION"|"MUHAMMAD_GONI_COLLEGE_OF_LEGAL_AND_ISLAMIC_STUDIES"|"FEDERAL_UNIVERSITY_KASHERE"|"GOMBE_STATE_UNIVERSITY"|"FEDERAL_COLLEGE_OF_EDUCATION"|"SCHOOL_OF_LEGAL_AND_ISLAMIC_STUDIES_NAFADA"|"COE_BILLIRI"|"HEALTH_TECHNOLOGY_KALTUNGO"|"FEDERAL_COLLEGE_OF_HORTICULTURE_DADIN_KOWA_GOMBE"|"TARABA_STATE_UNIVERSITY"|"YOBE_STATE_UNIVERSITY"|"SULE_LAMIDO_UNIVERSITY"|"JIGAWA_STATE_COLLEGE_OF_EDUCATION_GUMEL"|"FEDERAL_UNIVERSITY_DUTSE"|"HUSSAINI_ADAMU_FEDERAL_POLYTECHNIC_HADEJA"|"NCE_RINGIM"|"JIGAWA_STATE_POLYTECHNIC"|"AHMADU_BELLO_UNIVERSITY_ZARIA"|"KADUNA_STATE_UNIVERSITY"|"KADUNA_STATE_POLYTECHNIC"|"NUHU_BAMALI_POLYTECHNIC_ZARIA"|"FEDERAL_COLLEGE_OF_EDUCATION_ZARIA"|"DIVISION_OF_AGRICULTURE_ABU_ZARIA"|"FEDERAL_COOPERATIVE_COLLEGE_KADUNA"|"COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_MAKARFI"|"SCHOOL_OF_BASIC_AND_REMEDIAL_STUDIES_ABU"|"SCHOOL_OF_NURSING_ABU_TEACHING_HOSPITAL_TUDUN_WADA"|"BAYERO_UNIVERSITY_KANO"|"KANO_UNIVERSITY_OF_SCIENCE_AND_TECHNOLOGY_WUDIL"|"FEDERAL_COLLEGE_OF_EDUCATION_BICHI"|"MAITAMA_SULE_UNIVERSITY"|"FEDERAL_COLLEGE_OF_EDUCATION_KANO"|"UMARU_MUSA_YARADUWA_UNIVERSITY_KATSINA"|"FEDERAL_UNIVERSITY_DUTSINMMA"|"ISAH_KAITA_COLLEGE_OF_EDUCATION"|"HASSAN_USMAN_POLYTECHNIC_KATSINA"|"FEDERAL_COLLEGE_OF_EDUCATION_KATSINA"|"SCHOOL_OF_HEALTH_TECHNOLOGY_KANKIYA"|"SCHOOL_OF_NURSING_KATSINA"|"YUSUF_BALA_USMAN_SCHOOL_OF_LEGAL_STUDIES_KATSINA"|"FEDERAL_UNIVERSITY_BIRNIN_KEBBI"|"KEBBI_STATE_UNIVERSITY_OF_SCIENCE_AND_TECHNOLOGY_ALIERU"|"WAZIRI_UMMARU_FEDERAL_POLYTECHNIC_BIRNIN_KEBBI"|"COLLEGE_OF_AGRICULTURE_ZURU"|"ADAMU_AUGI_COLLEGE_OF_EDUCATION_ARGUNGU"|"KEBBI_STATE_POLYTECHNIC_DAKINGARI"|"SCHOOL_OF_NURSING_BIRNIN_KEBBI"|"KEBBI_STATE_COLLEGE_OF_HEALTH_JEGA"|"USMANU_DANFODIYO_UNIVERSITY_SOKOTO"|"SOKOTO_STATE_UNIVERSITY"|"COLLEGE_OF_EDUCATION_SOKOTO"|"UMMARU_ALI_SHINKFI_POLYTECHNIC_SOKOTO"|"FEDERAL_UNIVERSITY_GUSAU"|"FEDERAL_POLYTECHNIC_KAURA_NAMDODA"|"FEDERAL_COLLEGE_OF_EDUCATION_TECHNICAL_GUSAU"|"COLLEGE_OF_EDUCATION_MARU"|"COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_TSAFE"|"SCHOOL_OF_NURSING_AND_MIDWIFE_PRE_GUSAU"|"ABDU_GUSAU_POLYTECHNIC_TALATA_MAFARA"|"COLLEGE_OF_AGRICULTURE_AND_ANIMAL_SCIENCE_BAKURA"|"ZAMFARA_COLLEGE_OF_ART_AND_SCIENCE_GUSAU"|"EKITI_STATE_UNIVERSITY"|"FEDERAL_UNIVERSITY_OYE_EKITI"|"YABA_COLLEGE_OF_EDUCATION_YABA"|"ADENIRAN_OGUNSANYA_COLLEGE_OF_EDUCATION_IJANIKIN"|"UNIVERSITY_OF_LAGOS_AKOKA"|"LAGOS_STATE_POLYTECHNIC_IKORODU"|"LAGOS_STATE_COLLEGE_OF_HEALTH_AND_TECH_YABA"|"LAGOS_STATE_UNIVERSITY_OJO"|"FEDERAL_COLLEGE_OF_EDUCATION_AND_TECHNICAL_YABA"|"FEDERAL_POLYTECHNIC_ILARO"|"MOSHOOD_ABIOLA_POLYTECHNIC"|"OLABISI_ONABANJO_UNIVERSITY"|"FCE_OSIELE_ABEOKUTA"|"OGUN_STATE_INSTITUTE_OF_TECHNOLOGY_IGBESA"|"TAI_SHOLARIN_UNIVERSITY_OF_EDUCATION"|"FEDERAL_UNIVERSITY_OF_AGRICULTURE_ABEOKUTA"|"OGUN_STATE_COLLEGE_OF_HEALTH_TECHNOLOGY"|"FEDERAL_UNIVERSITY_OF_TECHNOLOGY_AKURE"|"ADEKUNLE_AJASIN_UNIVERSITY_AKUNGBA"|"ADEYEMI_UNIVERSITY"|"OBAFEMI_AWOLOWO_UNIVERSITY_ILE_IFE"|"OSUN_STATE_UNIVERSITY_OSOGBO"|"FEDERAL_POLYTECHNIC_EDE"|"OSUN_STATE_COLLEGE_OF_HEALTH_ILESHA"|"OSUN_STATE_COLLEGE_OF_EDUCATION_ILA_OROGUN"|"ASANUSIYAH_COLLEGE_ODE_OMU"|"OSUN_STATE_UNIVERSITY_OSOGBO_IKIRE_CAMPUS"|"UNIVERSITY_OF_IBADAN"|"OYO_STATE_COLLEGE_OF_HEALTH_SCIENCE_AND_TECH_ELEYELE_IBADAN"|"LADOKE_AKINTOLA_UNIVERSITY_OF_TECHNOLOGY_OGBOMOSHO"|"OYO_STATE_COLLEGE_OF_AGRICULTURE_AND_TECHNOLOGY_IGBOORA"|"EMMANUEL_ALAYANDE_COLLEGE_OF_EDUCATION_OYO"|"FEDERAL_COLLEGE_OF_AGRICULTURE_MOOR_PLANTATION"|"OKE_OGUN_POLYTECHNIC_SAKI"|"MUFUTAU_LANIHUN_COLLEGE_OF_EDUCATION_IBADAN"|"POLYTECHNIC_OF_IBADAN"
}

export type PatronProfileData = {
  title: string
  firstName: string
  lastName: string
  otherNames: string
  occupation: string
  placeOfWork: string
  stateOfResidence: string
  post: string
  email: string
  phoneNumber: string
  avatarUrl: string
  institutionId: string
  stateProfileId: string
  zoneProfileId: string
  necProfileId: string
}

export type StateProfileData = {
  address: string
  state: string
  zone:  "SOUTH_WEST" | "NORTH_WEST" | "NORTH_CENTRAL" | "NORTH_EAST"
  email: string
  phoneNumber: string
  avatarUrl: string
  zoneProfileId: string
}

export type ZoneProfileData = {
  zone:  "SOUTH_WEST" | "NORTH_WEST" | "NORTH_CENTRAL" | "NORTH_EAST"
  address: string
  email: string
  phoneNumber: string
  avatarUrl: string
}

export type NecProfileData = {
  address: string
  email: string
  phoneNumber: string
  avatarUrl: string
}


export type ConferenceData = {
  title: string
  desc: string
  venue: string
  thumbnailUrl: string
  createdBy: string
  date: Date
}

export type ConferenceRegisterData = {
  emailAddress: string
  attendeeId: string
  membershipType: "TIMSANITE" | "IOTB" | "OTHERS"
  paymentStatus: "PAYMENT_SUCCESSFUL" | "PAYMENT_PENDING"
}

export type PostData = {
  title: string,
  desc: string,
  thumbnailUrl: string,
  author: string,
  // userLikeId: string,
  // userDislikeId: string,
  userId: string,
}

export type BroadcastData = {
  title: string,
  desc: string,
  thumbnailUrl: string,
  author: string,

}

export type IOTBTechApplication = {
  currentJobSituation: "STUDENT" | "EMPLOYED" | "UNEMPLOYED" | "SELF_EMPLOYED";
  stateOfResidence: string;
  userId: string;
  institutionOrCompany?: string;
  educationalBackground:
    | "O_LEVEL"
    | "BSC"
    | "MSC"
    | "ASSOCIATE"
    | "PHD"
    | "PROFESSIONAL_CERTIFICATION"
    | "OTHERS";
  itSkillLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  specialization?: string;
  mentor: boolean;
  ownLaptop: boolean;
  laptopSpec: string;
  committed: boolean;
  challenge: string;
  techJourney: string;
  realtimeSolution: string;
  collaborationTool:
    | "ZOOM"
    | "GOOGLE_MEET"
    | "MICROSOFT_TEAMS"
    | "FREE_CONFERENCE_CALL"
    | "SLACKS"
    | "OTHERS";
  feedbackAndInquiry: string;
  stack: "PRODUCT_DESIGN" | "GRAPHICS" | "WEB" | "CLOUD";
  emailAddress: string;
  pcHours: number
  weeklyHours: number
};