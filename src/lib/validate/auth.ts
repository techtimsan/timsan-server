import { NextFunction, Request, Response } from "express";
import { Schema, string, z } from "zod";
import { ErrorHandler } from "../../utils";
import { ZodIssue, ZodError } from "zod";

// custom zod error formatter
const formatZodIssue = (issues: ZodIssue[]): string => {
  const errorFields = issues.map((issue) => issue.path.join(", "));

  const fields = errorFields.join(", ");
  return `${fields} - is Required`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
  const { issues } = error;

  if (issues.length) {
    // const currentIssue = issues[0];

    return formatZodIssue(issues);
  }

  return null;
};

export const ResetPasswordSchema = z.object({
  token: z.string().min(6).max(6),
  userId: z.string().cuid({ message: "Invalid User Id Provided" }),
  newPassword: z.string().min(6),
});

export const RequestResetLink = z.object({
  email: z.string().email(),
});

export const RegisterUserSchema = z.object({
  accountType: z.enum(["MEMBER", "INSTITUTION", "STATE", "ZONAL", "NEC"]),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const CreateNewsSchema = z.object({
  title: z.string().min(5),
  desc: z.string().min(5),
  author: z.string().min(3),
  // userId: z.string().min(3),
  // userLikeId: z.string().min(0),
  // userDislikeId: z.string().min(0),
  // thumbnailUrl: z.string().min(6)
});

export const CreateBroadCastSchema = z.object({
  title: z.string().min(5),
  desc: z.string().min(5),
  author: z.string().min(3),
  // thumbnailUrl: z.string().min(6)
});

export const resendVerificationLinkSchema = z.object({
  email: z.string().email(),
});

export const CreateNewConferenceSchema = z.object({
  title: z.string().min(5),
  venue: z.string().min(5),
  desc: z.string().min(5),
  date: z.string().datetime(),
  createdBy: z.string().min(3),
  thumbnailUrl: z.string().min(5).url(),
});

export const RegisterForConferenceSchema = z.object({
  emailAddress: z.string().email(),
  attendeeId: z.string(),
  membershipType: z.enum(["TIMSANITE", "IOTB", "OTHERS"]),
  paymentStatus: z.enum(["PAYMENT_SUCCESSFUL", "PAYMENT_PENDING"]),
});

export const AddNewBookELibrarySchema = z.object({
  category: z.enum([
    "FAYDAH_BOOKS",
    "POETRY",
    "SEERAH",
    "HADITH",
    "FIQH",
    "PROJECTS_OR_MAGAZINES",
    "ARTICLES",
  ]),
  thumbnailUrl: z.string(),
  rating: z.number(),
  title: z.string(),
  author: z.string(),
  desc: z.string(),
});

export const TiletsCourseSchema = z.object({
  thumbnailUrl: z.string(),
  title: z.string(),
  date: z.string(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  rating: z.number(),
  instructor: z.string(),
});

export const AddInstitutionProfileSchema = z.object({
  institutionName: z.enum([
    "UNIVERSITY_OF_ABUJA",
    "FEDERAL_COLLEGE_OF_EDUCATION_ZUBA",
    "KOGI_STATE_UNIVERSITY",
    "KOGI_STATE_POLYTECHNIC",
    "FEDERAL_UNIVERSITY_LOKOGA",
    "FEDERAL_POLYTECHNIC_IDAH",
    "COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_IDAH",
    "UNIVERSITY_OF_ILORIN",
    "KWARA_STATE_UNIVERSITY_MOLETE",
    "COLLEGE_OF_EDUCATION_ILORIN",
    "COLLEGE_OF_EDUCATION_ORO",
    "FEDERAL_POLYTECHNIC_OFFA",
    "KWARA_STATE_POLYTECHNIC_ILORIN",
    "KWARA_STATE_COLLEGE_OF_HEALTH_TECHNOLOGY_OFFA",
    "COLLEGE_OF_EDUCATION_LAFIA_AJI",
    "FEDERAL_UNIVERSITY_LAFIA",
    "FEDERAL_POLYTECHNIC_NASSARAWA",
    "COLLEGE_OF_AGRICULTURE_LAFIA",
    "SCHOOL_OF_HEALTH_KEFFI",
    "COLLEGE_OF_EDUCATION_AKWANGA",
    "NASSARAWA_STATE_UNIVERSITY_KEFFI",
    "ISA_MUSTAPHA_AGWAEI_POLYTECHNIC_LAFIA",
    "FEDERAL_UNIVERSITY_OF_TECHNOLOGY_MINNA",
    "IBRAHIM_BADAMASI_BABANGIDA_UNIVERSITY_LAPAI",
    "FCE_KONTONGORA",
    "MODIBBO_ADAMA_UNIVERSITY_OF_TECHNOLOGY_YOLA",
    "FCE_YOLA",
    "COLLEGE_FOR_LEGAL_STUDIES_YOLA",
    "ADAMAWA_STATE_UNIVERSITY_MUBI",
    "ADAMAWA_STATE_POLYTECHNIC_YOLA",
    "FEDERAL_POLY_MUBI",
    "COLLEGE_OF_AGRIC_GANYE",
    "COLLEGE_OF_HEALTH_TECH_MUBI",
    "KANZUL_ISLAM_ACADEMY_YOLA",
    "SCHOOL_FOR_ARABIC_AND_ISLAMIC_STUDIES_YOLA",
    "ABUBAKAR_TAFAWA_BALEWA_UNIVERSITY",
    "BAUCHI_STATE_UNIVERSITY_GADAU",
    "BILL_AND_MELINDA_COLLEGE_OF_HEALTH_TECHNOLOGY_NINGI",
    "AMINU_SALE_COLLEGE_OF_EDUCATION_AZARE",
    "AD_RUFAI_COLLEGE_OF_EDUCATION",
    "LEGAL_AND_GENERAL_STUDIES_MISAU",
    "ADAMU_TAFAWA_BALEWA_COLLEGE_OF_EDUCATION_KANGERE",
    "BILYAMINU_USMAN_COLLEGE_OF_EDUCATION_DASS",
    "COLLEGE_OF_AGRICULTURE_BAUCHI",
    "UNIVERSITY_OF_MAIDUGURI",
    "RAMAT_POLYTECHNIC",
    "KASHIM_IBRAHIM_COLLEGE_OF_EDUCATION",
    "MUHAMMAD_GONI_COLLEGE_OF_LEGAL_AND_ISLAMIC_STUDIES",
    "FEDERAL_UNIVERSITY_KASHERE",
    "GOMBE_STATE_UNIVERSITY",
    "FEDERAL_COLLEGE_OF_EDUCATION",
    "SCHOOL_OF_LEGAL_AND_ISLAMIC_STUDIES_NAFADA",
    "COE_BILLIRI",
    "HEALTH_TECHNOLOGY_KALTUNGO",
    "FEDERAL_COLLEGE_OF_HORTICULTURE_DADIN_KOWA_GOMBE",
    "TARABA_STATE_UNIVERSITY",
    "YOBE_STATE_UNIVERSITY",
    "SULE_LAMIDO_UNIVERSITY",
    "JIGAWA_STATE_COLLEGE_OF_EDUCATION_GUMEL",
    "FEDERAL_UNIVERSITY_DUTSE",
    "HUSSAINI_ADAMU_FEDERAL_POLYTECHNIC_HADEJA",
    "NCE_RINGIM",
    "JIGAWA_STATE_POLYTECHNIC",
    "AHMADU_BELLO_UNIVERSITY_ZARIA",
    "KADUNA_STATE_UNIVERSITY",
    "KADUNA_STATE_POLYTECHNIC",
    "NUHU_BAMALI_POLYTECHNIC_ZARIA",
    "FEDERAL_COLLEGE_OF_EDUCATION_ZARIA",
    "DIVISION_OF_AGRICULTURE_ABU_ZARIA",
    "FEDERAL_COOPERATIVE_COLLEGE_KADUNA",
    "COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_MAKARFI",
    "SCHOOL_OF_BASIC_AND_REMEDIAL_STUDIES_ABU",
    "SCHOOL_OF_NURSING_ABU_TEACHING_HOSPITAL_TUDUN_WADA",
    "BAYERO_UNIVERSITY_KANO",
    "KANO_UNIVERSITY_OF_SCIENCE_AND_TECHNOLOGY_WUDIL",
    "FEDERAL_COLLEGE_OF_EDUCATION_BICHI",
    "MAITAMA_SULE_UNIVERSITY",
    "FEDERAL_COLLEGE_OF_EDUCATION_KANO",
    "UMARU_MUSA_YARADUWA_UNIVERSITY_KATSINA",
    "FEDERAL_UNIVERSITY_DUTSINMMA",
    "ISAH_KAITA_COLLEGE_OF_EDUCATION",
    "HASSAN_USMAN_POLYTECHNIC_KATSINA",
    "FEDERAL_COLLEGE_OF_EDUCATION_KATSINA",
    "SCHOOL_OF_HEALTH_TECHNOLOGY_KANKIYA",
    "SCHOOL_OF_NURSING_KATSINA",
    "YUSUF_BALA_USMAN_SCHOOL_OF_LEGAL_STUDIES_KATSINA",
    "FEDERAL_UNIVERSITY_BIRNIN_KEBBI",
    "KEBBI_STATE_UNIVERSITY_OF_SCIENCE_AND_TECHNOLOGY_ALIERU",
    "WAZIRI_UMMARU_FEDERAL_POLYTECHNIC_BIRNIN_KEBBI",
    "COLLEGE_OF_AGRICULTURE_ZURU",
    "ADAMU_AUGI_COLLEGE_OF_EDUCATION_ARGUNGU",
    "KEBBI_STATE_POLYTECHNIC_DAKINGARI",
    "SCHOOL_OF_NURSING_BIRNIN_KEBBI",
    "KEBBI_STATE_COLLEGE_OF_HEALTH_JEGA",
    "USMANU_DANFODIYO_UNIVERSITY_SOKOTO",
    "SOKOTO_STATE_UNIVERSITY",
    "COLLEGE_OF_EDUCATION_SOKOTO",
    "UMMARU_ALI_SHINKFI_POLYTECHNIC_SOKOTO",
    "FEDERAL_UNIVERSITY_GUSAU",
    "FEDERAL_POLYTECHNIC_KAURA_NAMDODA",
    "FEDERAL_COLLEGE_OF_EDUCATION_TECHNICAL_GUSAU",
    "COLLEGE_OF_EDUCATION_MARU",
    "COLLEGE_OF_HEALTH_SCIENCE_AND_TECHNOLOGY_TSAFE",
    "SCHOOL_OF_NURSING_AND_MIDWIFE_PRE_GUSAU",
    "ABDU_GUSAU_POLYTECHNIC_TALATA_MAFARA",
    "COLLEGE_OF_AGRICULTURE_AND_ANIMAL_SCIENCE_BAKURA",
    "ZAMFARA_COLLEGE_OF_ART_AND_SCIENCE_GUSAU",
    "EKITI_STATE_UNIVERSITY",
    "FEDERAL_UNIVERSITY_OYE_EKITI",
    "YABA_COLLEGE_OF_EDUCATION_YABA",
    "ADENIRAN_OGUNSANYA_COLLEGE_OF_EDUCATION_IJANIKIN",
    "UNIVERSITY_OF_LAGOS_AKOKA",
    "LAGOS_STATE_POLYTECHNIC_IKORODU",
    "LAGOS_STATE_COLLEGE_OF_HEALTH_AND_TECH_YABA",
    "LAGOS_STATE_UNIVERSITY_OJO",
    "FEDERAL_COLLEGE_OF_EDUCATION_AND_TECHNICAL_YABA",
    "FEDERAL_POLYTECHNIC_ILARO",
    "MOSHOOD_ABIOLA_POLYTECHNIC",
    "OLABISI_ONABANJO_UNIVERSITY",
    "FCE_OSIELE_ABEOKUTA",
    "OGUN_STATE_INSTITUTE_OF_TECHNOLOGY_IGBESA",
    "TAI_SHOLARIN_UNIVERSITY_OF_EDUCATION",
    "FEDERAL_UNIVERSITY_OF_AGRICULTURE_ABEOKUTA",
    "OGUN_STATE_COLLEGE_OF_HEALTH_TECHNOLOGY",
    "FEDERAL_UNIVERSITY_OF_TECHNOLOGY_AKURE",
    "ADEKUNLE_AJASIN_UNIVERSITY_AKUNGBA",
    "ADEYEMI_UNIVERSITY",
    "OBAFEMI_AWOLOWO_UNIVERSITY_ILE_IFE",
    "OSUN_STATE_UNIVERSITY_OSOGBO",
    "FEDERAL_POLYTECHNIC_EDE",
    "OSUN_STATE_COLLEGE_OF_HEALTH_ILESHA",
    "OSUN_STATE_COLLEGE_OF_EDUCATION_ILA_OROGUN",
    "ASANUSIYAH_COLLEGE_ODE_OMU",
    "OSUN_STATE_UNIVERSITY_OSOGBO_IKIRE_CAMPUS",
    "UNIVERSITY_OF_IBADAN",
    "OYO_STATE_COLLEGE_OF_HEALTH_SCIENCE_AND_TECH_ELEYELE_IBADAN",
    "LADOKE_AKINTOLA_UNIVERSITY_OF_TECHNOLOGY",
  ]),
  zone: z.enum(["SOUTH_WEST", "NORTH_WEST", "NORTH_CENTRAL", "NORTH_EAST"]),
  acronym: z.string(),
  address: z.string(),
  lat: z.number(),
  long: z.number(),
  email: z.string().email(),
  state: z.string(),
  phoneNumber: z.string(),
  // stateProfileId: z.string()
});

// nec profile
export const CreateNecProfileSchema = z.object({
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatarUrl: z.string(),
});

export const CreateZoneProfileSchema = z.object({
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatarUrl: z.string(),
  zone: z.enum(["SOUTH_WEST", "NORTH_WEST", "NORTH_CENTRAL", "NORTH_EAST"]),
});

export const CreateStateProfileSchema = z.object({
  address: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  avatarUrl: z.string(),
  zone: z.enum(["SOUTH_WEST", "NORTH_WEST", "NORTH_CENTRAL", "NORTH_EAST"]),
  state: z.string(),
  zoneProfileId: z.string(),
});

export const CreateExcoProfileSchema = z.object({
  avatarUrl: z.string(),
  courseOfStudy: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  graduationDate: z.string(),
  graduationStatus: z.enum(["GRADUATE", "UNDER_GRADUATE", "POST_GRADUATE"]),
  lastName: z.string(),
  occupation: z.string(),
  phoneNumber: z.string(),
  post: z.string(),
  stateOfOrigin: z.string(),
  stateOfResidence: z.string(),
  otherNames: z.string().optional(),
  institutionId: z.string(),
});

export const RegisterFellowshipSchema = z.object({
  currentJobSituation: z.enum([
    "STUDENT",
    "EMPLOYED",
    "UNEMPLOYED",
    "SELF_EMPLOYED",
  ]),
  stateOfResidence: z.string(),
  userId: z.string(),
  institutionOrCompany: z.string().optional(),
  educationalBackground: z.enum([
    "O_LEVEL",
    "BSC",
    "MSC",
    "ASSOCIATE",
    "PHD",
    "PROFESSIONAL_CERTIFICATION",
    "OTHERS",
  ]),
  itSkillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
  specialization: z.string().optional(),
  mentor: z.boolean(),
  ownLaptop: z.boolean(),
  laptopSpec: z.string(),
  committed: z.boolean(),
  challenge: z.string(),
  techJourney: z.string(),
  realtimeSolution: z.string(),
  collaborationTool: z.enum([
    "ZOOM",
    "GOOGLE_MEET",
    "MICROSOFT_TEAMS",
    "FREE_CONFERENCE_CALL",
    "SLACKS",
    "OTHERS",
  ]),
  feedbackAndInquiry: z.string(),
  stack: z.enum(["PRODUCT_DESIGN", "GRAPHICS", "WEB", "CLOUD"]),
  emailAddress: z.string(),
  pcHours: z.number(),
  weeklyHours: z.number(),
});

export const validateData =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
        ...req.params,
        ...req.query,
        ...req.file,
      });

      next();
    } catch (error: any) {
      // console.log(error)
      return next(new ErrorHandler(formatZodError(error) as string, 400));
    }
  };
