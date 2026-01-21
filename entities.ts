// MATURE (for now)
// Stop - https://gemini.google.com/app/6d6dff3e004cda21
// StopTypes (add more or create a new entity for non-passenger stops?)
    // Incidents, Breaks, Refuel, Maintenance, Inspection -
// Trip
// Quick-turnaround trips (e.g., Methadone clinic) 
// Route
// Shift
// Journey
// Recurring trips - now called Standing Orders 
// RouteManifest - a collection of trips to be done together, eg. school bus route
// User types - Employee, Driver, Admin, Dispatcher, Passenger, Student, Guardian
// Passenger authorizations (Medicaid, Insurance, School Board)
// Funding source
// Payments/Claims/Billing 
// Driver Certifications/Licenses/Compliance - how to model this?
// Driver online status (eg., online/available, offline/unavailable, on-break) - modeled as ShiftSession
// Vehicle
// Vehicle Maintenance/Inspections/Licenses/Insurance 
// Partner-generated trips and other entities need to have a partnerId
// Expand StopProcedure so that there could be for different stop types (eg pickup only or dropoff only)
// Create Start/End shift procedures
// Escort is the legal guardian who could sign for the passenger - how to model this?


// TODOS
// Scheduling Personnel using the interfaces already created: ShiftPersonnel, CrewConfiguration, ScheduleTemplate, TimeOffRecord


// =================================================================================
// SECTION 1: CORE ENUMS & CONSTANTS
// This section defines the fundamental, constant values used throughout the entire
// data model, such as statuses, types, and predefined categories.
// =================================================================================

/**
 * Represents the high-level lifecycle of a Trip, from initial request
 * through to final billing.
 */
export enum TripStatus {
  // --- Pre-Approval States ---
  /** The trip has been requested by a user but not yet reviewed by staff. */
  PendingApproval = 'PENDING_APPROVAL',
  /** The trip request has been reviewed and rejected. */
  Rejected = 'REJECTED',

  // --- Planning & Scheduling States ---
  /** The trip is approved and is waiting to be scheduled onto a route. */
  Approved = 'APPROVED',
  /** The trip has been assigned to a driver's route for a specific day. */
  Scheduled = 'SCHEDULED',

  // --- Execution States ---
  /** The driver has begun executing the route this trip is on. */
  InProgress = 'IN_PROGRESS',

  // --- Terminal (Completed) States ---
  /** All stops on the trip were successfully completed. Ready for billing. */
  Completed = 'COMPLETED',
  /** The trip could not be completed as planned (e.g., passenger no-show, cancellation). */
  Incomplete = 'INCOMPLETE',
  /** The trip was canceled before execution began. */
  Canceled = 'CANCELED',
}

/**
 * A simple, human-readable status for displaying the real-time progress
 * of a trip on a frontend application. This is a computed, denormalized field.
 */
export enum LiveStatus {
  Dispatched = 'DISPATCHED',
  EnRouteToPickup = 'EN_ROUTE_TO_PICKUP',
  WaitingAtPickup = 'WAITING_AT_PICKUP',
  Transporting = 'TRANSPORTING',
  WaitingAtDropoff = 'WAITING_AT_DROPOFF',
}

/** Defines the possible categories for a Place. */
export enum PlaceType {
  Hospital = 'HOSPITAL',
  Clinic = 'CLINIC',
  School = 'SCHOOL',
  Residence = 'RESIDENCE',
  Business = 'BUSINESS',
  /** For locations without a building, like a street corner bus stop. */
  Intersection = 'INTERSECTION', 
  Airport = 'AIRPORT',
}

/** * Defines the functional attributes of an AccessPoint. 
 * An AccessPoint can have multiple tags.
 */
export enum AccessPointTag {
  Entrance = 'ENTRANCE',
  Exit = 'EXIT',
  DropOff = 'DROP_OFF',
  PickUp = 'PICK_UP',
  WheelchairAccessible = 'WHEELCHAIR_ACCESSIBLE',
  StretcherAccessible = 'STRETCHER_ACCESSIBLE',
  AmbulanceBay = 'AMBULANCE_BAY',
  ParentDropOff = 'PARENT_DROP_OFF',
  BusZone = 'BUS_ZONE',
}

/** Represents a standard geographic coordinate. */
type GPSLocation = {
  lat: number;
  lng: number;
}

/** Defines the possible types for a vehicle in the fleet. */
type VehicleType = 'sedan' | 'van' | 'wheelchair_van' | 'suv';

/** Defines the gender of a person, used for matching constraints. */
type Gender = 'female' | 'male' | 'non-binary';

/** A list of supported languages, represented by their ISO 639-1 codes. */
type LanguageCode = 'en' | 'es' | 'fr';

/**
 * Enumerates the specific, actionable tasks a driver must perform at a stop.
 * These are often dictated by funding sources or company policy for compliance.
 */
enum StopProcedureType {
  PassengerSignature = 'PASSENGER_SIGNATURE',
  GuardianSignature = 'GUARDIAN_SIGNATURE',
  FacilityStaffSignature = 'FACILITY_STAFF_SIGNATURE',
  PhotoOfDropoff = 'PHOTO_OF_DROPOFF',
  ScanPatientID = 'SCAN_PATIENT_ID',
  CollectCopay = 'COLLECT_COPAY',
  SecureMobilityDevice = 'SECURE_MOBILITY_DEVICE',
  // --- Assistance Levels ---
  /** Driver assists from origin door to vehicle and from vehicle to destination door. */
  ASSIST_DOOR_TO_DOOR = 'ASSIST_DOOR_TO_DOOR',
  
  /** Driver must ensure passenger is transferred to the care of another responsible adult. */
  ASSIST_HAND_TO_HAND = 'ASSIST_HAND_TO_HAND',
}

/**
 * Defines the high-level purpose of a stop. This distinguishes between
 * passenger-related activities and internal operational tasks.
 */
enum StopType {
  // --- Passenger-Related Stops ---
  Pickup = 'PICKUP',
  Dropoff = 'DROPOFF',

  // --- Driver & Vehicle Service Stops ---
  /** A scheduled or ad-hoc break for the driver. */
  Break = 'BREAK',
  
  /** A stop to refuel the vehicle. */
  Refuel = 'REFUEL',
  
  /** A stop for scheduled or unscheduled vehicle maintenance. */
  Maintenance = 'MAINTENANCE',
  
  /** An explicit, scheduled waiting period, typically between a drop-off and pickup at the same location. */
  Wait = 'WAIT',
}

/**
 * Represents the lifecycle of a stop, from initial planning through execution
 * and final completion or failure.
 */
enum StopStatus {
  // --- Planning States ---
  /**
   * The stop is scheduled but has not yet been dispatched to a driver's active route.
   */
  Pending = 'PENDING',

  /**
   * The stop is dispatched to a driver, but they have not yet started traveling towards it.
   */
  Assigned = 'ASSIGNED',

  // --- Execution States ---
  /**
   * The driver has started traveling to this stop's location. This is their active target.
   */
  EnRoute = 'EN_ROUTE',

  /**
   * The driver has arrived at the location and is performing the necessary actions
   * (e.g., waiting for the passenger, loading equipment).
   */
  Arrived = 'ARRIVED',

  // --- Terminal (Completed) States ---
  /**
   * The stop's objective was successfully met.
   * - For a pickup, the passenger is now onboard.
   * - For a drop-off, the passenger has been delivered.
   */
  Completed = 'COMPLETED',

  // --- Terminal (Failed/Canceled) States ---
  /**
   * The driver arrived at the location, but the stop could not be completed
   * (e.g., passenger was not present). This is a billable failure.
   */
  NoShow = 'NO_SHOW',

  /**
   * The stop was canceled before it was completed. This can be initiated by the
   * passenger or the company and may have different billing implications than a NoShow.
   */
  Canceled = 'CANCELED',
}

/**
 * Describes the final result of a stop after it has been attempted.
 * This is crucial for billing, reporting, and payroll.
 */
enum StopOutcome {
    CompletedAsPlanned = 'COMPLETED_AS_PLANNED',
    CompletedWithVariance = 'COMPLETED_WITH_VARIANCE', // e.g., guest no-show
    PassengerNoShow = 'PASSENGER_NO_SHOW',
    CanceledAtDoor = 'CANCELED_AT_DOOR',
    VehicleBrokeDown = 'VEHICLE_BROKE_DOWN',
}

/** The category of an unplanned event that disrupts operations. */
export enum IncidentType {
  VehicleAccident = 'VEHICLE_ACCIDENT',
  VehicleBreakdown = 'VEHICLE_BREAKDOWN',
  PassengerMedicalEmergency = 'PASSENGER_MEDICAL_EMERGENCY',
  DriverMedicalEmergency = 'DRIVER_MEDICAL_EMERGENCY',
  SafetyConcern = 'SAFETY_CONCERN', // e.g., passenger behavior
  ServiceDelay = 'SERVICE_DELAY',     // e.g., extreme traffic, road closure
}

/** The lifecycle status of an incident report from creation to resolution. */
export enum IncidentStatus {
  Reported = 'REPORTED',       // The initial report has been made.
  InProgress = 'IN_PROGRESS',  // A dispatcher is actively managing the situation.
  Resolved = 'RESOLVED',       // The immediate operational issue is fixed (e.g., new vehicle dispatched).
  Closed = 'CLOSED',           // All follow-up actions (reports, etc.) are complete.
}

export enum PartnerContractStatus {
  Draft = 'DRAFT',
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Terminated = 'TERMINATED',
}

export enum AuthorizationStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Exhausted = 'EXHAUSTED',
  Canceled = 'CANCELED',
}

export enum EligibilityStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  PendingVerification = 'PENDING_VERIFICATION',
}

export enum BusinessRuleType {
  MileageLimit = 'MILEAGE_LIMIT',
  PriorAuthRequired = 'PRIOR_AUTH_REQUIRED',
  ServiceCovered = 'SERVICE_COVERED',
}

export enum BusinessRuleUnit {
    Miles = 'miles',
    Trips = 'trips',
}

export enum ServiceCodeType {
  HCPCS = 'HCPCS',
  CPT = 'CPT',
  ICD10 = 'ICD-10',
  Modifier = 'MODIFIER',
}

export enum AncillaryServiceType {
  Meal = 'MEAL',
  Lodging = 'LODGING',
  EscortPayment = 'ESCORT_PAYMENT',
}

export enum AncillaryServiceStatus {
  Requested = 'REQUESTED',
  Approved = 'APPROVED',
  Denied = 'DENIED',
  Provided = 'PROVIDED',
}

export enum ClaimStatus {
  Draft = 'DRAFT',
  Submitted = 'SUBMITTED',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID',
  Denied = 'DENIED',
  PendingInfo = 'PENDING_INFO',
}

/** The category of the stored document. */
export enum DocumentType {
  Registration = 'REGISTRATION',
  Insurance = 'INSURANCE',
  Invoice = 'INVOICE',
  Title = 'TITLE',
  Photo = 'PHOTO',
  Other = 'OTHER',
}

/** The type of entity the document is associated with. */
export enum AssociatedEntityType {
  Vehicle = 'VEHICLE',
  MaintenanceRecord = 'MAINTENANCE_RECORD',
  Employee = 'EMPLOYEE',
  Trip = 'TRIP',
}

/**
 * A role that can be assigned to a TripCompanion.
 */
export enum TripCompanionRole {
  Guardian = 'GUARDIAN',
  Nurse = 'NURSE',
  CaseManager = 'CASE_MANAGER',
  Aide = 'AIDE',
  Sibling = 'SIBLING',
  Guest = 'GUEST',
  Other = 'OTHER',
}

/** A predefined list of actions that can be tracked in an audit log. */
type AuditAction = 'create' | 'update' | 'delete' | 'access' | 'login' | 'logout' | 'password_change' | 'role_change' | 'data_export' | 'data_import' | 'permission_change' | 'other';

/**
 * A frozen object defining the types of spaces available in a vehicle,
 * such as for wheelchairs or ambulatory passengers. Using 'as const' ensures
 * type safety and allows for easy creation of related types.
 */
const SPACE_TYPES = {
  WHEELCHAIR: { key: 'whc', name: 'Wheelchair', abbreviation: 'WHC' },
  AMBULATORY: { key: 'amb', name: 'Ambulatory', abbreviation: 'AMB' },
  STRETCHER:  { key: 'str', name: 'Stretcher', abbreviation: 'STR' },
} as const;

// =================================================================================
// SECTION 2: REUSABLE TYPE DEFINITIONS & SHAPES
// This section contains smaller, reusable type aliases and interfaces that are
// composed into the larger, core entities.
// =================================================================================

/**
 * A metadata object to track the provenance and verification status of a piece of data.
 * This is crucial for data quality, compliance, and billing accuracy.
 */
type Verification = {
  status: 'UNVERIFIED' | 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED_INCORRECT';
  /** The ID of the user or system that last verified the data. */
  verifiedBy?: string; 
  /** The method used for verification (e.g., 'STATE_PORTAL', 'STAFF_MANUAL_ENTRY'). */
  verificationMethod?: string;
  lastVerifiedAt?: ISO8601;
};


/**
 * The master record for a facility or location. It holds the official
 * address and high-level information. (e.g., "Mercy General Hospital").
 */
export interface Place {
  id: string; // e.g., "place_101"
  tenantId: string; // FK to Tenant
  name: string; // e.g., "Mercy General Hospital"
  type: PlaceType;

  // The official, mail-able address
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
 
  // An optional central coordinate for displaying the whole place on a map
  centerGps?: GPSLocation;
}

/**
 * A specific, navigable point at a Place. This provides the "rooftop-level"
 * precision drivers need. (e.g., "Emergency Room Entrance").
 */
export interface AccessPoint {
  id: string; // e.g., "ap_202"
  tenantId: string; // FK to Tenant
  placeId: string; // FK to Place, e.g., "place_101"

  name: string; // e.g., "Emergency Room Entrance"
  gps: GPSLocation; // The PRECISE coordinates for this point
  
  /** A list of attributes describing this point. Replaces the single 'type'. */
  tags: AccessPointTag[]; // e.g., [AccessPointTag.Entrance, AccessPointTag.AmbulanceBay]
  
  /** * CRITICAL: The hours this entrance is usable. Can be a simple string
   * or a more structured object for programmatic checks.
   */
  operatingHours?: string; // e.g., "24/7" or "Mon-Fri 07:00-18:00"
  
  instructions?: string; // e.g., "Use patient drop-off lane on the left."
}

/** Represents an employee assigned to a shift and their specific role. */
type ShiftPersonnel = {
  employeeId: string; // FK to Employee
  /** The operational role of this person for the duration of the shift. */
  role: 'Driver' | 'EMT' | 'Paramedic' | 'Attendant' | 'Other';
};

/**
 * Represents one leg of a multi-trip Journey. It holds a reference to a Trip
 * and can contain metadata about the transition to the subsequent leg.
 */
type JourneyLeg = {
  tripId: string; // FK to the Trip entity
  
  /** Instructions for the scheduler/driver for the period immediately following this leg. */
  transitionToNext?: {
    /** The type of transition. 'WaitAndReturn' signals that the crew must wait on-site. */
    type: 'WaitAndReturn';
    
    /** The expected duration of the wait. (e.g., 'PT10M' for 10 minutes). */
    duration: ISO8601;
  };
};

/** Represents an escort or additional guest traveling with the primary passenger. */
type Escort = {
  name: string;
  type: 'Guardian' | 'Nurse' | 'Guest' | 'Other';
  notes?: string;
};

/**
 * A standardized shape for storing route data from a directions API.
 */
type DirectionsData = {
  /** The encoded polyline string used to draw the route on a map. */
  encodedPolyline: string;
  /** The estimated total distance of the route. */
  distance: { 
    text: string;  // e.g., "10.5 mi"
    value: number; // in meters
  };
  /** The estimated duration of the route. */
  duration: {
    text: string;  // e.g., "22 mins"
    value: number; // in seconds
  };
};

/**
 * A type alias for a string formatted according to ISO 8601.
 * This can represent either a specific point in time (e.g., '2025-09-10T12:00:00Z')
 * or a duration (e.g., 'PT1H20M' for 1 hour and 20 minutes).
 */
type ISO8601 = string; 

/**
 * Defines a time constraint for an event, specifying the earliest and latest
 * possible start and end times.
 */
type TimeWindow = {
    minStartTime?: string; 
    maxStartTime?: string;
    minEndTime?: string;
    maxEndTime?: string;
}

/** A programmatic key derived from the SPACE_TYPES constant. */
type SpaceTypeKey = typeof SPACE_TYPES[keyof typeof SPACE_TYPES]['key'];

/** A shape defining a specific space within a vehicle. */
type SpaceType = {
  readonly key: string; // The programmatic key (e.g., 'whc')
  name: string;         // The display name (e.g., 'Wheelchair')
  abbreviation?: string;
};

/**
 * Represents the capacity needs for a trip or the capacity change at a stop.
 * The keys are `SpaceTypeKey`s (e.g., 'whc', 'amb') and values are the count.
 */
export type CapacityRequirements = {
  [K in SpaceTypeKey]?: number; // The '?' makes properties optional
};

/** Represents a specific skill a driver possesses and their proficiency level. */
type DriverSkill = {
    name: string;      // e.g., 'pediatric_care', 'bilingual_spanish', 'defensive_driving'
    level: number;    // Proficiency level, e.g., 1-5 scale
}

/** Defines a requirement for a driver to have a certain skill, optionally at a minimum level. */
type SkillRequirement = {
    name: string;      // e.g., 'pediatric_care', 'bilingual_spanish', 'defensive_driving'
    minLevel?: number; // Optional: The minimum proficiency level required
}

/** Represents a dependency where one stop must occur after another. */
type StopDependency = {
    precedingStop: string; // ID of the dependent stop
}


/** Defines procedures to add or remove from a stop's default set. */
type ProcedureOverrides = {
  /** Add specific procedure rules for this stop only. */
  add?: ProcedureRule[];
  /** Remove inherited procedure rules for this stop by their type. */
  remove?: StopProcedureType[]; // e.g., [StopProcedureType.PassengerSignature]
}

// =================================================================================
// SECTION 3: CONSTRAINT MODEL
// This section defines the structure for applying rules, preferences, and
// prohibitions to trips, ensuring the right driver and vehicle are assigned.
// =================================================================================

/**
 * Defines the shape of constraints that apply to a Driver.
 */
interface DriverConstraints {
    // Instance-based constraints
    ids?: string[];

    // Attribute-based constraints
    gender?: Gender;
    languages?: LanguageCode[];

    /**
     * A list of AttributeDefinition IDs the assigned driver MUST possess.
     * This is a hard requirement for scheduling.
     * e.g., ['CLEARED_FOR_MINORS']
     */
    requiredAttributes?: string[];
}


/** Defines the shape of constraints that apply to a Vehicle. */
interface VehicleConstraints {
    // Instance-based constraints
    ids?: string[];

    // Attribute-based constraints
    type?: VehicleType;
}

/** A set of constraints for a driver and a vehicle. */
interface ConstraintSet {
    driver?: DriverConstraints;
    vehicle?: VehicleConstraints;
}

/**
 * The main container for all trip constraints, categorized by their strictness.
 * This structure is essential for optimization engines to find valid and
 * optimal assignments.
 */
interface TripConstraints {
    // SOFT: "Try to match these if possible."
    preferences?: ConstraintSet;

    // HARD: "The assignment MUST match these attributes."
    requirements?: ConstraintSet; // New field!

    // HARD: "Do NOT assign if these match."
    prohibitions?: ConstraintSet;
}

// =================================================================================
// SECTION 4: USER & PEOPLE ENTITIES
// This section contains all entities that represent people or organizations
// interacting with the system, such as drivers, passengers, and administrators.
// =================================================================================

/**
 * The central authentication record for a person. It uses the ID from the
 * authentication provider and links to various role-specific profiles.
 */
interface User {
  /** The unique ID from the third-party authentication provider (e.g., Firebase Auth UID). */
  id: string;
  
  email: string;
  phoneNumber?: string;
  displayName?: string;
  photoUrl?: string;
  
  // --- Links to Role Profiles (The "Spokes") ---
  employeeId?: string;   // FK to Employee
  passengerId?: string;  // FK to Passenger
  guardianId?: string;   // FK to Guardian
  partnerUserId?: string; // FK to PartnerUser
}

/** A profile for an employee of a Partner organization (e.g., a hospital scheduler). */
interface PartnerUser {
  id: string;
  tenantId: string; // FK to Tenant
  userId: string; // FK to the central User record
  partnerId: string; // FK to the Partner organization
  roleIds: string[]; // FKs to Role
  jobTitle?: string;
}

/**
 * A profile for a person acting as a guardian.
 * Note: most data is on the link, as a guardian's permissions are context-specific.
 */
interface Guardian {
    id: string;
    tenantId: string; // FK to Tenant
    userId: string; // FK to the central User record
}

/**
 * Represents a person accompanying the primary passenger on a single trip.
 * This entity links a Trip to a companion, who may or may not be a
 * registered user in the system.
 */
interface TripCompanion {
  id: string;
  tenantId: string;
  tripId: string;      // FK to the Trip this person is on
  
  // --- Who is the companion? (Handles both registered and ad-hoc people) ---
  
  /** If the companion is a registered User (e.g., a Guardian), this links to their record. */
  userId?: string;      // FK to User
  
  /** If the companion is an ad-hoc guest, their name is captured here. */
  name?: string;
  
  // --- What is their role and permissions for this trip? ---
  
  /** The role of this person for this specific trip. */
  role: TripCompanionRole;
  
  /** Determines if this person is authorized to sign for the primary passenger. */
  canSignForPassenger: boolean;
  
  notes?: string;
}

/**
 * A profile containing data for an individual who is an employee of the company.
 * This is the core HR record for any staff member.
 */
interface Employee {
  id: string;
  tenantId: string; // FK to Tenant
  userId: string; // FK to the central User record
  
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  hireDate: ISO8601;
  
  /** The list of Role IDs assigned to this employee, granting them permissions. */
  roleIds: string[]; // FKs to Role
  
  /** If this employee is a driver, this links to their operational profile. */
  driverProfileId?: string; // FK to DriverProfile

  // --- General Profile Information ---
  imageUrl?: string;
  dateOfBirth?: ISO8601;
  address?: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  /**
   * A standard and essential HR field. If an employee has a medical emergency,
   * dispatch needs to know who to call immediately.
   * This links to the new, separate EmergencyContact entity to support multiple contacts.
   */
  emergencyContactIds?: string[]; // FKs to EmergencyContact
}

/**
 * A profile containing data specific to an employee who acts as a driver or crew.
 */
interface DriverProfile {
  id: string;
  employeeId: string; // FK to the parent Employee record

  /** The driver's specific operational skills. */
  skills?: DriverSkill[];

  // --- Licensing & Compliance ---
  /** The driver's primary identifier for their role. Essential for MVR checks. */
  driversLicenseNumber: string;
  /** The class of license, which determines the types of vehicles they can operate. */
  licenseClass: string; // e.g., "C", "CDL-B"
  /** Critical for compliance, e.g., 'P' (Passenger), 'S' (School Bus). */
  licenseEndorsements?: string[];
  /** The issuing state for the driver's license. */
  licenseState: string; // e.g., "CA", "NY"

  // --- Performance & Operations ---
  /** Key performance indicators (KPIs) for reviews and incentive programs. */
  performanceMetrics?: {
    onTimePercentage: number;
    passengerSatisfactionRating: number; // e.g., average 1-5 stars
    incidentFreeMiles: number;
  };
  
  /**
   * A denormalized, at-a-glance status computed from their credentials.
   * Allows the scheduling system to quickly filter out non-compliant drivers.
   */
  currentComplianceStatus: 'CLEAR' | 'NEEDS_RENEWAL' | 'SUSPENDED';
}

/**
 * A profile for an individual who receives transportation services.
 */
interface Passenger {
  id:string;
  tenantId: string; // FK to Tenant
  /** If the passenger was created by a partner, this links to them. */
  partnerId?: string; // FK to Partner
  /** Optional FK to User. A passenger might be created by a facility without a login. */
  userId?: string; 
  
  name: {
      first: string;
      last: string;
  };
  phoneNumber?: string;
  dateOfBirth?: ISO8601;
  gender?: Gender;
  
  // --- Profile Links ---
  // The presence of an ID indicates the passenger's type(s).
  patientProfileId?: string;  // FK to PatientProfile
  studentProfileId?: string;  // FK to StudentProfile
  
  /** The passenger's permanent, default set of constraints. */
  constraints?: TripConstraints;

  /** A passenger can have multiple emergency contacts. */
  emergencyContactIds?: string[]; // FKs to EmergencyContact
}

/**
 * A profile containing data specific to a passenger receiving medical transport (NEMT).
 */
interface PatientProfile {
  id: string;
  passengerId: string; // FK to Passenger
  
  imageUrl?: string;
  medicalRecordNumber?: string;
  mobilityStatus?: 'AMBULATORY' | 'WHEELCHAIR' | 'STRETCHER';
  specialInstructions?: string; // e.g., "Oxygen required", "Fall risk"
  
  /** The default funding/insurance info for this patient. */
  defaultFundingSourceId?: string; // FK to FundingSource

  // --- Identifiers & Billing (Sensitive - Must be encrypted at rest) ---
  
  /** Often required by Medicaid/Medicare for identity verification. */
  socialSecurityNumber?: string;
  
  /** The primary identifier for billing state Medicaid programs. */
  medicaidId?: string;
  medicaidId_verification?: Verification; // Example of verification metadata
  
  /** The primary identifier for billing federal Medicare programs. */
  medicareId?: string;
  
  /** Member ID for Managed Care Organizations (MCOs). */
  mcoMemberId?: string;
  
  // --- Medical & Operational Details ---

  /** Crucial for ensuring safety limits of vehicle lifts and for crew planning. */
  weightInPounds?: number;
  
  /** Informs crew how to best interact with the patient. */
  communicationNeeds?: ('NON_VERBAL' | 'HEARING_IMPAIRED' | 'REQUIRES_TRANSLATOR_ES')[];
  
  /** Critical for drivers to understand patient's needs and potential wander risk. */
  cognitiveStatus?: 'ALERT_AND_ORIENTED' | 'MILD_IMPAIRMENT' | 'MODERATE_IMPAIRMENT' | 'SEVERE_IMPAIRMENT';
  
  /** Ensures correct vehicle (e.g., with power inverter) and crew awareness. */
  requiredOnboardEquipment?: ('OXYGEN_CONCENTRATOR' | 'IV_PUMP' | 'FEEDING_PUMP')[];

  // --- Relationships & Coordination ---

  /** Point of contact for medical clarifications. */
  primaryCarePhysician?: {
    name: string;
    phoneNumber: string;
  };
  
  /** Direct link to the coordinator for the patient's transport (e.g., at a hospital). */
  caseManagerId?: string; // FK to a PartnerUser
  
  // --- Consent & Preferences (HIPAA Compliance) ---
  
  /** Explicit flag for HIPAA-compliant consent to share info. */
  consentToShareInfo: boolean;
  
  /** Ensures compliance with patient privacy preferences. */
  communicationPreferences?: {
    allowVoicemail: boolean;
    preferredLanguage: LanguageCode;
  };
}

/**
 * A profile containing data specific to a student passenger.
 */
interface StudentProfile {
  id: string;
  passengerId: string; // FK to Passenger
  
  imageUrl?: string;
  studentIdNumber?: string;
  schoolId?: string; // FK to a future School entity
  gradeLevel?: number;

  dismissalInstructions?: string; // e.g., "Must be met by guardian at bus stop."

  // --- Administrative & District Info ---
  
  /** Essential for reporting, billing, and associating with district-wide policies. */
  schoolDistrictId?: string; // FK to a future SchoolDistrict entity
  
  /** Tracks the reason for eligibility, often required for state funding reports. */
  transportationEligibility?: 'ELIGIBLE_DISTANCE' | 'ELIGIBLE_IEP' | 'INELIGIBLE_PAID' | 'OTHER';
  
  // --- Safety & Operational Details ---

  /** The student's default, recurring route for daily manifest generation. */
  assignedRouteId?: string; // FK to RouteManifest
  
  /** Links the student to their designated pickup/drop-off spot. */
  assignedStopId?: string; // FK to a future BusStop entity
  
  /**
   * Structured, critical safety data replacing free-text dismissal instructions.
   * This is a key liability and safety feature.
   */
  pickupDropoffRestrictions?: ('GUARDIAN_MUST_BE_PRESENT' | 'SIBLING_CAN_RECEIVE' | 'SELF_RELEASE_OK')[];
  
  /** Captures specific needs from an IEP or 504 Plan for compliance. */
  requiredAccommodations?: ('WHEELCHAIR_LIFT' | 'SAFETY_HARNESS' | 'SEAT_NEAR_DRIVER' | 'BEHAVIORAL_AIDE_REQUIRED')[];
  
  /** Critical medical info available to driver/aides in an emergency. */
  relevantAllergies?: string; // e.g., "Severe peanut allergy, carries EpiPen"
  
  /** Confidential, need-to-know info for drivers to de-escalate situations. */
  behavioralNotes?: string;
}

/**
 * A linking entity defining a Guardian's relationship to and permissions for a Passenger.
 */
interface GuardianPassengerLink {
  id: string;
  tenantId: string; // FK to Tenant
  guardianId: string; // FK to Guardian
  passengerId: string; // FK to Passenger
  
  relationship: 'PARENT' | 'LEGAL_GUARDIAN' | 'CASEWORKER' | 'OTHER';
  
  /**
   * Granular permissions using an Attribute-Based Access Control (ABAC) model.
   * This provides flexibility for complex family and care scenarios.
   */
  permissions: {
    canManageSchedule: boolean;
    canManageBilling: boolean;
    canViewHistory: boolean;
    isPrimaryContact: boolean;
    receivesNotifications?: {
      onPickup: boolean;
      onDropoff: boolean;
      onDelay: boolean;
    }
  };
  
  /** Granular control over how and when the guardian receives notifications. */
  notificationPreferences?: {
    channels: ('SMS' | 'EMAIL' | 'PUSH')[];
    quietHours?: {
      start: string; // "22:00"
      end: string;   // "08:00"
      timezone: string; // e.g., "America/New_York"
    };
  };
}


// =================================================================================
// SECTION 5: CORE OPERATIONAL ENTITIES
// These are the central entities that model the day-to-day operations of
// planning and executing transportation: Trips, Stops, Routes, and Shifts.
// =================================================================================

/**
 * A base interface containing all properties common to any scheduled stop.
 * This is not an entity itself but a foundation for other stop types.
 */
interface BaseStop {
    id: string;
    status: StopStatus;
    duration: ISO8601;
    
    /** The primary operational region for dispatching this stop. */
    regionId?: string;

    /** The calculated geographical region this stop falls into, used for precise analytics. */
    timeWindows: TimeWindow[];
    
    /** Instructions FOR the driver about how to execute this stop. */
    operationalNotes?: string;
    
    /** Dependencies on other stops (e.g., must happen after another stop). */
    stopDependencies: StopDependency[];

    // Actual arrival/departure times are common to all stop types
    actualArrivalTime?: string;
    actualDepartureTime?: string;
}

/**
 * Represents a stop for picking up or dropping off a passenger. This is a
 * key component of a Trip.
 */
interface PassengerStop extends BaseStop  {
    type: StopType.Pickup | StopType.Dropoff;
    passengerId?: string; // FK to Passenger
    accessPointId: string; // FK to AccessPoint
    placeId: string; // FK to Place
    /** The denormalized change in vehicle capacity at this stop (e.g., +1 whc, -2 amb). Critical for schedulers. */
    capacityDelta: CapacityRequirements;
    
    procedureOverrides?: ProcedureOverrides;
}

/**
 * A stop related to a driver's or vehicle's needs, not a passenger.
 * Examples include meal breaks, refueling, or maintenance.
 */
interface DriverServiceStop extends BaseStop {
    type: StopType.Break | StopType.Refuel | StopType.Maintenance | StopType.Wait; // Non-passenger types
    
    // Location is optional; a break might not have a fixed location until the driver initiates it.
    location?: GPSLocation;
}

/**
 * Represents the fundamental transportation request. It defines who is being
 * transported, where they are going, and what rules apply. This is the "plan".
 */
interface Trip  {
    id: string;
    tenantId: string; // FK to Tenant
    /** If the trip was created by a partner, this links to them. */
    partnerId?: string; // FK to Partner
    
    /** The high-level administrative status of the trip. */
    status: TripStatus;
    
    passengerId: string; // FK to Passenger
    fundingSourceId: string;   // FK to FundingSource

    /** A link to group multiple trips (e.g., outbound and return) into a single journey. */
    journeyId?: string;

    /** If this trip is part of a multi-passenger run, this links to the manifest. */
    routeManifestId?: string; // FK to RouteManifest

    /** The specific Authorization record used to approve and validate this trip. */
    authorizationId?: string; // FK to Authorization
    
    /**
     * A container for external identifiers. This is critical for interoperability with
     * brokers and other partners, allowing data to be reconciled across systems.
     */
    externalIds?: {
      brokerTripId?: string;
      // ... other potential external IDs like appointmentId
    }

    /** Defines if the pickup is at a fixed time or initiated by the passenger. */
    pickupType: 'Scheduled' | 'WillCall';

    /** A list of non-primary passengers (e.g., guardians, nurses) on the trip. */
    companionIds?: string[]; // FKs to TripCompanion. 
    
    /** The primary operational region for dispatching and management. */
    regionId?: string;

    procedureSetId?: string;    // An OPTIONAL override for this specific trip
    constraints?: TripConstraints; // An OPTIONAL override for this specific trip
    capacityRequirements: CapacityRequirements; // e.g., { whc: 1, amb: 2 } for a passenger + escort

    /**
     * The ideal, static route from pickup to dropoff, calculated once at creation.
     * This is the "plan of record" shown to the guardian.
     */
    plannedRoute?: DirectionsData;
    
    /** The ordered list of stops that define the trip's itinerary. */
    stops: PassengerStop[];

    /** Private notes for internal staff (dispatch, billing). Not visible to the driver. */
    internalNotes?: string;

    /** If the trip status is 'Rejected', this field should explain why. */
    rejectionReason?: string;

    /** If the trip status is 'Canceled', this provides a structured reason. */
    cancellationReason?: string; // e.g., 'CANCELED_BY_PASSENGER', 'CANCELED_BY_FACILITY'

     /**
     * A denormalized field providing an explicit instruction to the scheduler/driver 
     * for what to do immediately after this trip is completed. Sourced from the 
     * parent Journey entity.
     */
    postTripDirective?: {
      type: 'WaitAndReturn';
      duration: ISO8601; // The duration of the wait
      nextTripId: string; // The ID of the trip to wait for
    };
}

/**
 * Represents a single driver's period of availability and their specific assignment.
 * It anchors the driver, vehicle, and time frame for a `Route`.
 */
interface Shift {
    id: string;
    tenantId: string; // FK to Tenant
    
    /** The vehicle assigned to operate for the duration of this shift. */
    vehicleId: string;
    
    /** * The list of personnel (crew) assigned to this shift. 
     * For NEMT, this may be a single driver.
     * For Ambulance, this will be a multi-person crew.
     */
    personnel: ShiftPersonnel[];
    
    /** The scheduled start and end time for this specific shift instance. */
    startTime: ISO8601;
    endTime: ISO8601;
    
    /** The designated starting and ending location for the shift. */
    startLocation: GPSLocation;
    endLocation: GPSLocation;

    /**
     * Pre-defined breaks or maintenance stops that must occur during the shift.
     * This aligns with optimization and compliance models.
     */
    requiredStops?: DriverServiceStop[];
}

/**
 * Represents a single, continuous period of time a driver was online
 * during a parent Shift. A single Shift can have multiple sessions (e.g., 
 * if the driver accidentally clicks to end their shift and then has to go back online).
 */
interface ShiftSession {
  id: string;
  tenantId: string;
  shiftId: string;      // FK to the parent Shift
  startTime: ISO8601;   // When this specific session started
  endTime?: ISO8601;    // When this session ended. Null if it's the active session.
}

/**
 * Represents a collection of individual Trips that are grouped together to be
 * performed by a single vehicle in a single run. This is the core entity
 * for managing multi-passenger services like school buses or shuttles.
 */
interface RouteManifest {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // e.g., "Route 101 AM", "Airport Shuttle Loop"
  
  /** The list of individual Trip IDs that constitute this manifest. */
  tripIds: string[]; // FKs to Trip

  /** * The single, overarching Timefold Job ID generated from this manifest.
   * This is populated by the Adapter before sending to the optimizer.
   */
  optimizationJobId?: string;

  // Other potential properties
  status: 'PLANNING' | 'DISPATCHED' | 'COMPLETED';
  shiftId?: string; // The Shift (driver/vehicle) this manifest is assigned to
}

/**
 * Represents the final, optimized sequence of stops assigned to a specific Shift
 * for a given period. This is the "plan of execution" or manifest.
 */
interface Route {
    id: string;
    tenantId: string; // FK to Tenant
    
    /** The Shift that this Route is assigned to. This links to the crew and vehicle. */
    shiftId: string; // FK to Shift

    /** If this route was generated from a manifest, this links back to the source. */
    sourceRouteManifestId?: string; // FK to RouteManifest

    /** If this route was created in response to an incident, this links to it. */
    spawningIncidentId?: string; // FK to Incident

    /**
     * The final, ordered list of all stops (passenger, breaks, etc.) that the 
     * crew must perform. This is the "manifest" for the run.
     */
    stops: (PassengerStop | DriverServiceStop)[];

    // Other calculated properties from the optimizer
    // Estimated metrics might not be needed
    estimatedStartTime: ISO8601;
    estimatedEndTime: ISO8601;
    estimatedTotalDistance: number; // in meters
    estimatedDuration: ISO8601; // duration format
    actualStartTime?: ISO8601;
    actualEndTime?: ISO8601;
    actualTotalDistance?: number; // in meters
    actualDuration?: ISO8601; // duration format
}

// =================================================================================
// SECTION 6: SUPPORTING & CONTEXTUAL ENTITIES
// These entities provide context, rules, and organizational structure for the
// core operational entities. They include locations, regions, and compliance rules.
// =================================================================================


/**
 * Represents a digital file (e.g., PDF, image) stored in the system.
 * This provides a flexible way to manage paperwork like registrations,
 * insurance cards, repair invoices, and other important files.
 */
interface Document {
  id: string;
  tenantId: string;
  
  /** The name of the file. */
  fileName: string;
  /** The URL where the file is stored (e.g., in a cloud storage bucket). */
  fileUrl: string;
  documentType: DocumentType;

  /** The ID of the entity this document is linked to (e.g., a vehicleId). */
  associatedEntityId: string;
  /** The type of entity this document is linked to. */
  associatedEntityType: AssociatedEntityType;

  uploadDate: ISO8601;
  uploadedByUserId?: string; // FK to User
  notes?: string;
}

/**
 * Defines a reusable checklist for a vehicle inspection.
 * Each tenant can create their own templates.
 */
interface InspectionTemplate {
  id: string;
  tenantId: string; // FK to Tenant
  name: string;     // e.g., "Standard Van Pre-Shift Checklist"
  
  /** Defines when this template should be used. */
  type: 'PRE_SHIFT' | 'POST_SHIFT';
  
  /** The list of items the driver must check. */
  checklistItems: {
    category: string; // e.g., "Lights", "Tires", "Safety Equipment"
    prompt: string;   // e.g., "Check headlights, brake lights, and turn signals."
  }[];
}

/**
 * Represents a master definition for a type of stop procedure. This is the
 * system-wide, tenant-agnostic record of what a procedure is (e.g.,
 * 'Passenger Signature'), independent of any specific rules.
 */
interface ProcedureDefinition {
  /** The unique type of this procedure. */
  id: StopProcedureType;
  /** A human-readable name for the procedure. */
  name: string; // e.g., "Passenger Signature"
  /** A brief explanation of the procedure, often shown to the driver as an instruction. */
  description: string;
}

/** A defined geographical area for operational management, dispatching, and analytics. */
interface Region {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // e.g., "Downtown Core", "Northern Suburbs"
  /** Defines the geographical boundary using a standard GeoJSON Polygon format. */
  boundary?: {
    type: "Polygon";
    coordinates: number[][][]; // Array of lon/lat pairs
  };
  /** A simpler way to define a region by a list of postal codes. */
  zipCodes?: string[];
}

/**
 * Represents a specific rule that applies a ProcedureDefinition under
 * certain conditions. This is the 'instance' of a procedure within a
 * ProcedureSet, defining how and when it should be applied.
 */
interface ProcedureRule {
  /** The type of procedure this rule applies to. */
  procedureId: StopProcedureType; // FK to ProcedureDefinition
  /** Defines if the procedure is for pickups, dropoffs, or any stop. */
  appliesTo: 'PICKUP' | 'DROPOFF' | 'ANY';
}

/**
 * Represents a named, reusable collection of procedure rules. This allows for
 * the easy application of standard operating procedures to trips based on
 * criteria like funding source or partner requirements.
 */
interface ProcedureSet {
  id: string;
  tenantId: string;
  name: string; // e.g., "Medicaid Standard Procedures"
  /** The collection of specific rules that make up this set. */
  procedures: ProcedureRule[];
}

/**
 * The master account for a company licensing the software. All data in the system
 * is partitioned by a tenantId.
 */
interface Tenant {
  id: string;
  name: string; // "Your NEMT Company"

  // --- Administrative & Contact Details ---
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  
  // --- Tenant-wide Settings & Customization ---
  settings?: {
    regional: {
      timezone: string; // e.g., "America/New_York"
      currency: 'USD' | 'CAD';
    };
    branding: {
      logoUrl?: string;
      primaryColor?: string; // e.g., "#005A9C"
    };
    inspections: {
      requirePreShiftInspection: boolean;
      requirePostShiftInspection: boolean;
      defaultPreShiftTemplateId?: string;
      defaultPostShiftTemplateId?: string;
    };
    // You could add a section for billing defaults here as well
  };
}

/**
 * Represents a partner organization (e.g., hospital, school district) that a
 * Tenant provides transportation services to.
 */
interface Partner {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // "Mercy General Hospital", "ACME School District"

  /** A list of Funding Source IDs that users from this Partner are authorized to use. */
  authorizedFundingSourceIds: string[]; // FKs to FundingSource
}

/** Represents the entity paying for a trip, such as an insurance plan or a school board. */
interface FundingSource  {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // e.g., "State Medicaid Program", "Private Insurance Plan B"
  procedureSetId?: string; // FK to the required ProcedureSet
}

/**
 * Represents a recurring transportation need (Standing Order).
 * It generates Journey instances (containing their Trips) based on a
 * recurrence rule. This is the definitive model.
 */
interface StandingOrder {
  id: string;
  tenantId: string; // FK to Tenant
  /** If the StandingOrder was created by a partner, this links to them. */
  partnerId?: string; // FK to Partner
  name: string; // e.g., "John's M/W/F Dialysis"
  passengerId: string; // FK to Passenger
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';

  // --- Recurrence & Scheduling ---
  recurrenceRule: string; // iCalendar RRULE format
  exclusionDates?: string[]; // 'YYYY-MM-DD' format
  effectiveDateRange: {
    start: ISO8601;
    end: ISO8601;
  };

  /**
   * The blueprint of the Journey to be created for each occurrence.
   * This is the core of the template.
   */
  journeyTemplate: {
    // Properties to be copied to the generated Journey and its Trips
    fundingSourceId: string;
    constraints?: TripConstraints;
    capacityRequirements: CapacityRequirements;
    companionIds?: string[]; // FKs to TripCompanion. 
    internalNotes?: string;

    // The template for the legs and their underlying trips
    legs: {
      transitionToNext?: JourneyLeg['transitionToNext'];
      
      // Define the stops needed to create the trip for this leg.
      stops: {
        type: StopType.Pickup | StopType.Dropoff;
        accessPointId: string;
        placeId: string;
        duration: ISO8601;
        timeWindows: TimeWindow[];
        procedureOverrides?: ProcedureOverrides;
      }[];
    }[];
  };

  // --- Job Management ---
  lastGeneratedUpToDate?: ISO8601;
}

/**
 * Represents a sequence of related trips that form a single passenger order.
 * This is the container for round trips, multi-destination trips, etc.
 */
interface Journey {
  id: string;
  tenantId: string; // FK to Tenant
  /** If the Journey was created by a partner, this links to them. */
  partnerId?: string; // FK to Partner
  passengerId: string; // FK to Passenger
  
  /** An ordered array of JourneyLegs that make up the complete journey. */
  legs: JourneyLeg[];

  name?: string; // e.g., "Jane's Wednesday Appointments"
  bookingDate: ISO8601;

  /** If this Journey was created from a recurring template, this links back to it. */
  sourceStandingOrderId?: string; // FK to StandingOrder
}

/**
 * Represents an emergency contact for a passenger or employee.
 * Stored in a separate entity to support multiple contacts per person.
 */
interface EmergencyContact {
  id: string;
  tenantId: string; // FK to Tenant
  /** The ID of the person this contact is for (can be a Passenger or Employee). */
  personId: string;
  
  name: string;
  relationship: string;
  phoneNumber: string;
  /** Used to determine who to call first in an emergency. */
  priority: number; // e.g., 1 for primary, 2 for secondary
}

/** Represents an employee's recurring work schedule template. */
interface ScheduleTemplate {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // e.g., "Mon-Fri 9am-5pm", "4-on-4-off"
  // ... future properties for recurrence rules (e.g., iCal RRULE string)
};

/**
 * A persistent template for a crew and their default vehicle. This is used as a
 * blueprint to quickly create daily Shift instances.
 */
interface CrewConfiguration {
  id: string;
  tenantId: string; // FK to Tenant
  name: string; // e.g., "John D. - Van 12", "Ambulance A-Crew"
  
  /** The default vehicle for this crew configuration. */
  defaultVehicleId?: string; // FK to Vehicle
  
  /** The list of employees who are part of this default crew. */
  personnel: ShiftPersonnel[];
  
  /** The default recurring schedule for this crew. */
  scheduleTemplateId?: string; // FK to ScheduleTemplate
}

/** A record of an employee's approved time off. */
interface TimeOffRecord {
  id:string;
  tenantId: string; // FK to Tenant
  employeeId: string; // FK to Employee
  startTime: ISO8601;
  endTime: ISO8601;
  reason: 'Vacation' | 'Sick' | 'Personal' | 'Other';
  notes?: string;
}

// =================================================================================
// SECTION 7: RECONCILIATION, INCIDENT & AUDIT ENTITIES
// These entities are used to record what actually happened during operations,
// log exceptions and unplanned events, and track changes to the data.
// =================================================================================

/**
 * A detailed record of the actual outcome of a stop, completed by the driver.
 * This is the "ground truth" used for billing, compliance, and payroll.
 */
interface StopReconciliation {
    /** The ID of the stop from the Trip's 'stops' array that this record reconciles. */
    stopId: string;
    tenantId: string; // FK to Tenant
    
    outcome: StopOutcome;
    actualCapacityDelta: CapacityRequirements; 
    timestamp: string; // ISO 8601
    verifiedBy: string; // Employee ID of the driver
    verificationMethod: 'VISUAL' | 'PHOTO' | 'SIGNATURE' | 'SCAN';

    // Specific data fields for each verification method
    photoUrl?: string;
    signatureData?: string;
    scannedData?: {
        type: 'QR_CODE' | 'BARCODE' | 'NFC_TAG';
        value: string;
    };
    /** Captures the details of the person to whom the passenger was transferred.
     * Crucial for "ASSIST_HAND_TO_HAND" procedures.
     */
    handOffRecipient?: {
        type: 'GUARDIAN' | 'STAFF' | 'SELF' | 'OTHER';
        name?: string;
    };
    driverNotes?: string;
}



/**
 * An entity that stores the dynamic, real-time record of a trip's execution.
 * It is created when a Trip is dispatched and updated throughout its lifecycle.
 */
interface TripExecution {
  id: string;
  tenantId: string; // FK to Tenant
  tripId: string; // FK to the Trip
  routeId: string; // FK to the Route

  /** A computed, denormalized field for easy frontend consumption. */
  liveStatus: LiveStatus;

  /**
   * The live, temporary route from the driver's current location to the pickup point.
   * Generated by the driver's app when they are en route to the passenger.
   */
  approachRoute?: DirectionsData;
  
  /**
   * A new route calculated mid-trip, but ONLY if the driver deviates
   * significantly from the `plannedRoute`. This overrides the planned route
   * in the guardian's UI to provide an accurate, live path.
   */
  liveRoute?: DirectionsData;
  
  /** A high-level indicator of on-time performance for reporting. */
  onTimeStatus?: 'ON_TIME' | 'LATE' | 'EARLY';
  
  // Actual start and end times for the entire trip execution
  actualStartTime?: ISO8601;
  actualEndTime?: ISO8601;

  /** The collection of "ground truth" records for each stop, submitted by the driver. */
  reconciliations: StopReconciliation[];

  /**
   * For ambulance trips, this links to the record in a third-party ePCR system.
   * It is STRONGLY recommended to integrate with a dedicated, NEMSIS-compliant
   * ePCR vendor (e.g., ImageTrend, ESO) rather than building a clinical documentation
   * system internally. This field stores the unique ID from that external system.
   */
  ePCRReferenceId?: string;
}

/**
 * A lightweight record of a vehicle's real-time telemetry data.
 * This is the only vehicle-related entity designed for high-frequency updates.
 */
interface VehicleTelemetry {
  id: string; // Should be the same as the vehicleId for a 1-to-1 relationship
  tenantId: string; // FK to Tenant
  vehicleId: string; // FK to Vehicle
  
  /** The last known GPS location of the vehicle. */
  gps: GPSLocation;
  
  /** The timestamp of the last GPS update. */
  lastUpdatedAt: ISO8601;
}

/**
 * Represents a single, historical GPS data point for a vehicle.
 * These records should be stored in a dedicated TIME-SERIES DATABASE or data lake,
 * NOT in the primary operational database.
 */
interface VehicleLocationHistory {
  tenantId: string; // FK to Tenant
  vehicleId: string;    // FK to Vehicle
  shiftId?: string;     // The shift during which this ping was recorded
  driverId?: string;    // The driver operating the vehicle at the time
  
  /** The specific GPS location at this point in time. */
  gps: GPSLocation;
  
  /** The exact timestamp when this location was recorded. */
  timestamp: ISO8601;
}

/**
 * Represents a detailed record of an unplanned event that occurs during operations.
 * This is critical for safety, compliance, and operational improvement.
 */
interface Incident {
  id: string;
  tenantId: string; // FK to Tenant
  type: IncidentType;
  status: IncidentStatus;
  
  /** The time the incident was reported. */
  reportedAt: string; // ISO 8601
  
  /** The location where the incident occurred. */
  location: GPSLocation;
  
  /** The ID of the user who reported the incident (e.g., driver, dispatcher). */
  reportedBy: string; // FK to User
  
  // --- Links to Affected Entities ---
  driverId: string;
  vehicleId: string;
  
  /** The route that was disrupted by this incident. This is a critical link. */
  routeId: string; // FK to Route
  
  /** The specific stop that was in progress, if any. */
  activeStopId?: string; // FK to Stop
  
  /** The passenger(s) on board at the time of the incident. */
  passengerIdsOnBoard: string[];
  
  // --- Details and Resolution ---
  /** A detailed, free-text description of what happened. */
  description: string;
  
  /** A log of actions taken by the dispatcher to resolve the incident. */
  actionsTaken?: string[];
  
  /** A summary of the final resolution. */
  resolutionNotes?: string;
}

/**
 * A log entry to track changes made to any entity within the system,
 * providing a crucial audit trail for security and data integrity.
 */
interface AuditLog {
    id: string;
    tenantId: string; // FK to Tenant
    entityType: string; // e.g., 'User', 'Trip', 'Vehicle'
    entityId: string; // ID of the entity being changed
    action: AuditAction;
    changes?: any; // Could be a json diff or full snapshot of changes
    timestamp: string; // ISO 8601 timestamp
    userId?: string; // FK to User who made the change
    userRole?: string; // Role of the user who made the change
    ipAddress?: string; // IP address of the user
    notes?: string; // Optional notes about the change

}

// =================================================================================
// SECTION 8: COMPLIANCE & MAINTENANCE ENTITIES (PLACEHOLDERS)
// This section contains placeholder entities for future development related to
// driver/vehicle compliance, safety, and maintenance records.
// =================================================================================

/**
 * Represents a type of certification or license. This is a system-wide definition.
 * e.g., "Commercial Driver's License", "EMT-Basic", "Paramedic - State License"
 */
interface Credential {
  id: string;
  name: string;
  description?: string;
  issuingBody?: string; // e.g., "State of California", "NREMT"
}

/**
 * A linking entity that represents a specific credential held by an employee.
 * This is the verifiable, tenant-specific record.
 */
interface EmployeeCredential {
  id: string;
  tenantId: string; // FK to Tenant
  employeeId: string;    // FK to Employee
  credentialId: string;  // FK to Credential

  /** An explicit status to handle cases like pending verification or revocation. */
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  
  licenseNumber?: string;
  issueDate?: ISO8601;
  expirationDate: ISO8601; // CRITICAL for compliance checks
  
  /** A link to the scanned copy of the credential in the Document table. */
  documentId?: string; // FK to Document.
}

/**
 * Defines a type of non-licensed, often binary qualification or clearance.
 * This serves as the master list of possible attributes, defined system-wide.
 */
interface AttributeDefinition {
  id: string; // e.g., 'CLEARED_FOR_MINORS', 'SENIOR_SENSITIVITY_TRAINING'
  name: string; // e.g., "Cleared for Transport of Minors", "Senior Sensitivity Training"
  description: string;
  
  /** Optional: The standard period in months after which this attribute should be renewed. */
  renewalPeriodInMonths?: number;
}

/**
 * A linking entity representing an instance of an attribute held by a driver.
 * This provides the verifiable, tenant-specific, auditable record.
 */
interface DriverAttribute {
  id: string;
  tenantId: string; // FK to Tenant
  driverProfileId: string; // FK to DriverProfile
  
  /** The type of attribute this is. */
  attributeId: string; // FK to AttributeDefinition

  /** An explicit status to handle cases like pending verification or revocation. */
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  
  /** The date the attribute was awarded or the check was completed. */
  dateAwarded: ISO8601;
  
  /** The date this attribute expires and needs renewal. Critical for compliance. */
  expirationDate?: ISO8601;
  
  /** A URL to a scanned certificate, background check result, or other proof. */
  documentId?: string;
}



// the following entities are ideas
interface SafetyCheck  {id: string;}
interface VehicleInspection  {id:string;}

// =================================================================================
// SECTION 9: OTHER POSSIBLE ENTITIES (PLACEHOLDERS)
// =================================================================================

interface Notification  {id: string;}
interface Message  {id: string;}
interface Alert  {id: string;}
interface Report  {id: string;}

// =================================================================================
// SECTION 10: HR & PAYROLL ENTITIES (PLACEHOLDERS)
// This section contains entities related to time tracking, payroll, and other
// employee management functions.
// =================================================================================

/** Represents a single, consolidated entry of an employee's work for a pay period. */
interface Timesheet {
  id: string;
  tenantId: string; // FK to Tenant
  employeeId: string; // FK to Employee
  payPeriod: {
    startDate: ISO8601;
    endDate: ISO8601;
  };
  
  // Calculated metrics from operational data
  regularHours: number;
  overtimeHours: number;
  ptoHoursUsed: number;

  status: 'Pending' | 'Approved' | 'Processed';
  // ... other fields for adjustments, pay rates, total pay, etc.
}

// =================================================================================
// SECTION 11: ASSET & MAINTENANCE ENTITIES
// =================================================================================

// --- Enums for this Section ---

export enum VehicleStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  InMaintenance = 'IN_MAINTENANCE',
  Decommissioned = 'DECOMMISSIONED',
}

export enum ComplianceStatus {
  Clear = 'CLEAR',
  NeedsRenewal = 'NEEDS_RENEWAL',
  Suspended = 'SUSPENDED',
}

export enum MedicalServiceLevel {
  BLS = 'BLS', // Basic Life Support
  ALS = 'ALS', // Advanced Life Support
  CCT = 'CCT', // Critical Care Transport
}

export enum CredentialStatus {
  PendingVerification = 'PENDING_VERIFICATION',
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Revoked = 'REVOKED',
}

export enum EquipmentStatus {
  Available = 'AVAILABLE',
  InUse = 'IN_USE',
  InRepair = 'IN_REPAIR',
}

export enum WorkOrderStatus {
  Requested = 'REQUESTED',
  Scheduled = 'SCHEDULED',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Canceled = 'CANCELED',
}

export enum MaintenanceType {
  Preventative = 'PREVENTATIVE',
  Repair = 'REPAIR',
  Inspection = 'INSPECTION', // For formal, mandated inspections (e.g., annual state safety)
  Recall = 'RECALL',
}

export enum InspectionStatus {
  Pass = 'PASS',
  PassWithNotes = 'PASS_WITH_NOTES',
  Fail = 'FAIL',
}

// --- Asset & Maintenance Interfaces ---

/**
 * Represents a single vehicle in the fleet. This is the "digital twin" of the
 * physical asset, containing its static properties and core capabilities.
 */
interface Vehicle {
  id: string;
  tenantId: string;
  name: string; // e.g., "Van 12", "Ambulance 3"
  status: VehicleStatus;
  currentComplianceStatus: ComplianceStatus;

  // --- Core Details ---
  vin?: string;
  licensePlate: string;
  make?: string;
  model?: string;
  year?: number;
  homeRegionId?: string;

  // --- Capabilities (CRITICAL for Timefold) ---
  vehicleType: VehicleType; // From Section 1: 'sedan' | 'van' etc.
  capacityProfile: CapacityRequirements; // e.g., { whc: 2, amb: 4 }
  medicalCapabilities?: {
    levelOfService: MedicalServiceLevel;
    onboardEquipmentIds?: string[]; // FKs to Equipment
  };
  vehicleAttributes?: string[]; // e.g., ['POWER_INVERTER', 'BARIATRIC_RATED']
}

/**
 * Represents a time-sensitive, verifiable credential held by a vehicle.
 */
interface VehicleCredential {
  id: string;
  tenantId: string;
  vehicleId: string;     // FK to Vehicle
  credentialId: string;  // FK to a system-wide Credential definition
  status: CredentialStatus;
  policyOrDocumentNumber?: string;
  issueDate?: ISO8601;
  expirationDate: ISO8601;
  documentId?: string; // FK to the Document entity
}

/**
 * Represents a physical asset assigned to a vehicle.
 */
interface Equipment {
  id: string;
  tenantId: string;
  equipmentType: string; // e.g., "Defibrillator", "Oxygen Tank", "Child Car Seat"
  serialNumber?: string;
  status: EquipmentStatus;
  assignedVehicleId?: string; // FK to Vehicle
  lastServiceDate?: ISO8601;
  nextServiceDate?: ISO8601;
}

/**
 * A detailed record of a maintenance event, treated as a work order.
 */
interface MaintenanceRecord {
  id: string;  
  tenantId: string;
  vehicleId: string;
  status: WorkOrderStatus;
  type: MaintenanceType;
  description: string;
  odometerReading: number;

  costs?: {
    parts: number;
    labor: number;
    tax: number;
    total: number;
  };

  dateRequested?: ISO8601;
  scheduledDate?: ISO8601;
  completionDate?: ISO8601;
  
  externalVendorId?: string;
  internalMechanicIds?: string[];
  sourceInspectionId?: string;
  sourceIncidentId?: string;
  notes?: string;
}

/**
 * Represents a formal driver vehicle inspection report (DVIR).
 */
interface VehicleInspection {
  id: string;
  tenantId: string;
  vehicleId: string; // FK to Vehicle
  driverId: string;  // FK to Employee
  shiftId?: string; // FK to Shift
  
  // inspectionTemplateId?: string; // Optional: Link to a specific checklist
  status: InspectionStatus;
  odometerReading: number;
  inspectionDate: ISO8601;
  
  defectsFound?: {
    category: string;
    description: string;
    isCritical: boolean;
  }[];
  
  driverSignatureUrl?: string;
  notes?: string;
}

/**
 * A record of a single vehicle refueling event.
 */
interface FuelLog {
  id: string;
  tenantId: string;
  vehicleId: string; // FK to Vehicle
  driverId?: string;  // FK to Employee
  
  transactionDate: ISO8601;
  odometerReading: number;
  
  gallons: number;
  costPerGallon: number;
  totalCost: number;
  
  vendorName?: string; // e.g., "Shell", "Chevron"
  fuelCardId?: string;
}

// =================================================================================
// SECTION 12:  FINANCIAL, BILLING & CONTRACTUAL ENTITIES
// =================================================================================

/**
 * Represents the master contract with a partner organization.
 */
interface PartnerContract {
  id: string;
  tenantId: string;
  partnerId: string;
  name: string;
  status: PartnerContractStatus;
  effectiveDateRange: {
    start: ISO8601;
    end: ISO8601;
  };
  sla?: {
    onTimePerformanceTarget: number;
    maxWaitTimeMinutes: number;
  };
}

/**
 * Represents a specific billing rule associated with a PartnerContract.
 */
interface ContractBillingRule {
  id: string;
  tenantId: string;
  contractId: string;
  serviceCodeId: string;
  rate: number;
  rules?: {
    firstUnitsFree?: number;
    tieredRates?: { threshold: number; rate: number }[];
    timeOfDayMultiplier?: { startHour: number; endHour: number; multiplier: number }[];
  };
  effectiveDate?: ISO8601;
  endDate?: ISO8601;
  notes?: string;
}

/**
 * Defines a specific destination that is covered by this authorization.
 */
type AuthorizedDestination = {
  placeId: string;
  documentationUrl?: string;
  notes?: string;
};

/**
 * Represents an approval from a funding source for a passenger to receive services.
 */
interface Authorization {
  id: string;
  tenantId: string;
  passengerId: string;
  fundingSourceId: string;
  status: AuthorizationStatus;
  authorizationCode: string;
  effectiveDateRange: {
    start: ISO8601;
    end: ISO8601;
  };
  authorizedDestinations?: AuthorizedDestination[];
  limits?: {
    maxTrips?: number;
    maxMiles?: number;
    maxCost?: number;
  };
  approvedServiceCodes?: string[];
}

/**
 * A historical record of a passenger's coverage with a specific funding source.
 */
interface EligibilityRecord {
  id: string;
  tenantId: string;
  passengerId: string;
  fundingSourceId: string;
  status: EligibilityStatus;
  effectiveStartDate: ISO8601;
  effectiveEndDate: ISO8601;
  lastVerifiedAt: ISO8601;
}

/**
 * Represents a configurable business rule defined by a Payer (FundingSource).
 */
interface BusinessRule {
  id: string;
  tenantId: string;
  fundingSourceId: string;
  type: BusinessRuleType;
  value: {
    limit?: number;
    unit?: BusinessRuleUnit;
    context?: string;
  };
  description: string;
}

/**
 * Represents standardized billing, procedure, or diagnosis codes.
 */
interface ServiceCode {
  id: string;
  tenantId: string;
  code: string;
  description: string;
  type: ServiceCodeType;
  defaultRate?: number;
}

/**
 * Represents a single line item on a claim.
 */
interface ClaimLineItem {
  id: string;
  tenantId: string;
  serviceCodeId: string;
  chargeAmount: number;
  units: number;
  modifiers?: string[];
}

/**

 * Represents ancillary services like meals or lodging that may be covered.
 */
interface AncillaryService {
  id: string;
  tenantId: string;
  tripId: string;
  type: AncillaryServiceType;
  status: AncillaryServiceStatus;
  cost?: number;
  authorizationCode?: string;
}

/**
 * Represents a claim submitted to a funding source for payment.
 */
interface Claim {
  id:string;
  tenantId: string;
  tripIds: string[];
  fundingSourceId: string;
  status: ClaimStatus;

  // --- Recommended Additions ---
  /** Optional: The Partner on whose behalf the trip(s) were performed. */
  partnerId?: string; // FK to Partner
  /** Optional: The specific contract governing this claim's rates and rules. */
  contractId?: string; // FK to PartnerContract
  
  lineItems: ClaimLineItem[];
  diagnosisCodeIds: string[];
  totalBilledAmount: number;
  dateSubmitted?: ISO8601;
}

/**
 * Represents an adjustment or reason code for a paid or denied line item.
 */
type RemittanceAdjustment = {
  lineItemId: string;
  reasonCode: string;
  amount: number;
  description?: string;
};

/**
 * Represents a payment record from a funding source.
 */
interface Remittance {
  id: string;
  tenantId: string;
  fundingSourceId: string;
  paymentDate: ISO8601;
  totalPaidAmount: number;
  checkOrReferenceNumber: string;
  claimIds: string[];
  adjustments?: RemittanceAdjustment[];
}

// =================================================================================
// SECTION 13: RBAC & PERMISSIONS
// This section contains entities for a flexible, multi-tenant Role-Based Access Control system.
// =================================================================================

/**
 * A granular permission representing a single action that can be performed in the system.
 * These are typically defined at the system level and are consistent for all tenants.
 */
interface Permission {
  /** A programmatic, unique ID, e.g., 'trip:create', 'billing:view'. */
  id: string; 
  name: string; // A human-readable name, e.g., "Create Trips"
  description?: string;
}

/**
 * A named collection of permissions that can be assigned to an employee or client user.
 */
interface Role {
  id: string;
  /** If null, this is a system-wide role (e.g., SuperAdmin). Otherwise, it belongs to a specific tenant. */
  tenantId?: string; 
  name: string; // e.g., "Dispatcher", "Partner Scheduler"
  description?: string;
  
  /** The list of permission IDs associated with this role. */
  permissionIds: string[]; // FKs to Permission
}

// =================================================================================
// SECTION 14: DYNAMIC UI & FORM CONFIGURATION
// These entities and types define a comprehensive system for creating tenant-specific,
// semi-dynamic forms based on the static data models. This system enables each tenant
// to customize which optional fields they use and how forms are structured.
// =================================================================================

// ---------------------------------------------------------------------------------
// CONDITIONAL LOGIC & DEPENDENCIES
// ---------------------------------------------------------------------------------

/**
 * Defines a condition that can be evaluated against form field values.
 * Used for conditional visibility, required status, and disabled state.
 */
export type FieldCondition = {
  /** The name of the field to watch (supports dot notation for nested fields) */
  watchField: string;
  
  /** The comparison operator to apply */
  operator: 
    | 'equals' 
    | 'notEquals' 
    | 'contains' 
    | 'notContains'
    | 'greaterThan' 
    | 'lessThan'
    | 'greaterThanOrEqual'
    | 'lessThanOrEqual'
    | 'isEmpty' 
    | 'isNotEmpty'
    | 'in'
    | 'notIn';
  
  /** The value to compare against (not required for isEmpty/isNotEmpty operators) */
  value?: any;
};

/**
 * Defines a logical group of conditions with AND/OR operators.
 * Allows for complex conditional logic like "show if (A AND B) OR (C AND D)".
 */
export type ConditionalLogic = {
  /** How to combine multiple conditions */
  operator: 'AND' | 'OR';
  
  /** The list of conditions to evaluate */
  conditions: FieldCondition[];
};

// ---------------------------------------------------------------------------------
// DYNAMIC OPTIONS & DATA SOURCES
// ---------------------------------------------------------------------------------

/**
 * Defines the source for dynamically fetching options for a select/dropdown field.
 * Supports filtering, sorting, caching, and query customization.
 */
export type DynamicOptions = {
  /** The entity name to fetch from the API (e.g., "region", "partner", "vehicle") */
  sourceEntity: string;
  
  /** The property on the fetched entity to use as the option's value (typically "id") */
  valueKey: string;
  
  /** The property on the fetched entity to use as the option's label (e.g., "name") */
  labelKey: string;
  
  /** Optional: Additional property to show as secondary text in dropdown */
  descriptionKey?: string;
  
  /**
   * Filter options based on other field values or static criteria.
   * Use ${fieldName} syntax to reference other form field values.
   * Example: { field: "placeId", operator: "equals", value: "${selectedPlaceId}" }
   */
  filters?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number | string[] | number[];
  }[];
  
  /** Sort the fetched options */
  sortBy?: {
    field: string;
    order: 'asc' | 'desc';
  };
  
  /** Additional query parameters to pass to the API endpoint */
  queryParams?: Record<string, string>;
  
  /** Caching configuration to improve performance */
  cache?: {
    enabled: boolean;
    /** Time-to-live in seconds (default: 300) */
    ttlSeconds?: number;
    /** Cache key strategy: 'global' caches for all users, 'tenant' caches per tenant */
    scope?: 'global' | 'tenant';
  };
  
  /** Maximum number of options to fetch (for performance) */
  limit?: number;
  
  /** Enable search/autocomplete for large option sets */
  searchable?: boolean;
};

/**
 * Defines a single key-value option for a select, radio, or checkbox group.
 * Used for static option lists.
 */
export type FormOption = {
  value: string | number | boolean;
  label: string;
  /** Optional description shown as helper text */
  description?: string;
  /** Disable this specific option */
  disabled?: boolean;
  /** Optional icon or color for visual distinction */
  metadata?: {
    icon?: string;
    color?: string;
  };
};

// ---------------------------------------------------------------------------------
// FIELD TYPE-SPECIFIC CONFIGURATIONS
// ---------------------------------------------------------------------------------

/**
 * Configuration for relationship/foreign key fields.
 * Handles the complexity of displaying and selecting related entities.
 */
export type RelationshipConfig = {
  /** The name of the related entity (e.g., "Region", "Partner") */
  entity: string;
  
  /** The field on the related entity to display (e.g., "name") */
  displayField: string;
  
  /** Allow creating a new related entity inline from this form */
  allowCreate?: boolean;
  
  /** Allow editing the related entity inline */
  allowEdit?: boolean;
  
  /** Show additional context about the selected entity */
  showDetails?: boolean;
  
  /** Filter the available related entities */
  filterBy?: {
    field: string;
    operator: 'equals' | 'in';
    /** Use ${fieldName} to reference other form field values */
    value: any;
  };
  
  /** For many-to-many relationships */
  isMultiple?: boolean;
};

/**
 * Configuration for array fields that contain multiple values.
 * Examples: tags, skills, authorized destination IDs.
 */
export type ArrayConfig = {
  /** Minimum number of items required */
  minItems?: number;
  
  /** Maximum number of items allowed */
  maxItems?: number;
  
  /** The type of items in the array */
  itemType: 'string' | 'number' | 'boolean' | 'object';
  
  /** For arrays of objects, define the schema for each item */
  itemSchema?: FormField[];
  
  /** Allow duplicates in the array */
  allowDuplicates?: boolean;
  
  /** Predefined options for array items (like a multi-select) */
  options?: FormOption[] | DynamicOptions;
};

/**
 * Configuration for file and image upload fields.
 */
export type UploadConfig = {
  /** Accepted file types (MIME types or extensions) */
  accept?: string | string[]; // e.g., "image/*", ".pdf", ["image/jpeg", "image/png"]
  
  /** Maximum file size in kilobytes */
  maxSizeKB?: number;
  
  /** Allow multiple file uploads */
  multiple?: boolean;
  
  /** Compress images before upload */
  compression?: {
    enabled: boolean;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-1
  };
  
  /** Where to store the uploaded files */
  storageLocation?: 'documents' | 's3' | 'local';
  
  /** Show image preview after upload */
  showPreview?: boolean;
};

/**
 * Configuration for computed/calculated fields that derive their value from other fields.
 */
export type ComputedConfig = {
  /** List of field names this computed field depends on */
  dependencies: string[];
  
  /**
   * Simple expression for basic calculations.
   * Use ${fieldName} to reference field values.
   * Example: "${firstName} ${lastName}" or "${price} * ${quantity}"
   */
  expression?: string;
  
  /**
   * Reference to a registered computation function for complex logic.
   * Example: "calculateAge" would reference a function registered in the system.
   */
  computeFn?: string;
  
  /** Whether to update in real-time as dependencies change */
  realTime?: boolean;
};

// ---------------------------------------------------------------------------------
// CORE FIELD DEFINITION
// ---------------------------------------------------------------------------------

/**
 * Defines the properties for a single field in a form.
 * This is the core building block of the configuration system.
 */
export type FormField = {
  /**
   * The name/path of the field, which MUST map to a key in the target entity.
   * Supports dot notation for nested properties (e.g., "address.street", "name.first").
   */
  name: string;
  
  /** Human-readable label displayed above/beside the field */
  label: string;
  
  /** The type of input field to render */
  fieldType: 
    | 'text' 
    | 'number' 
    | 'email'
    | 'tel'
    | 'url'
    | 'select' 
    | 'multiselect'
    | 'textarea' 
    | 'date' 
    | 'datetime'
    | 'time'
    | 'checkbox' 
    | 'radio'
    | 'switch'
    | 'file'
    | 'image'
    | 'richtext'
    | 'relationship'
    | 'array'
    | 'computed';
  
  // --- Layout & Sizing ---
  
  /** Width of the field within its container */
  width?: 'full' | 'half' | 'third' | 'quarter' | 'two-thirds' | 'three-quarters';
  
  /** Order/position within the group (for custom sorting) */
  order?: number;
  
  // --- Visibility & State ---
  
  /** Whether this field is required (static requirement) */
  required?: boolean;
  
  /** Make field required conditionally based on other field values */
  requiredWhen?: ConditionalLogic;
  
  /** Show/hide field based on conditions */
  visibilityConditions?: ConditionalLogic;
  
  /** Disable field based on conditions */
  disabledWhen?: ConditionalLogic;
  
  /** Make field read-only (visible but not editable) */
  readOnly?: boolean;
  
  /** Completely hide field from form (useful for programmatic fields) */
  hidden?: boolean;
  
  // --- Help & Guidance ---
  
  /** Placeholder text shown when field is empty */
  placeholder?: string;
  
  /** Helper text displayed below the field */
  description?: string;
  
  /** Tooltip text shown on hover */
  tooltip?: string;
  
  // --- Default & Initial Values ---
  
  /** Default value when creating a new entity */
  defaultValue?: any;
  
  /** Value to use when field is cleared */
  clearValue?: any;
  
  // --- Validation Rules ---
  
  /** Minimum length for text inputs */
  minLength?: number;
  
  /** Maximum length for text inputs */
  maxLength?: number;
  
  /** Minimum value for number inputs */
  min?: number;
  
  /** Maximum value for number inputs */
  max?: number;
  
  /** Step value for number inputs */
  step?: number;
  
  /** Regular expression pattern for validation */
  pattern?: string;
  
  /** Custom validation error messages */
  validationMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    min?: string;
    max?: string;
    pattern?: string;
    custom?: string;
  };
  
  /**
   * Reference to a custom validation function.
   * The function name should be registered in the validation registry.
   */
  customValidation?: string;
  
  /**
   * Enable async validation (e.g., checking uniqueness against database).
   * Requires a registered async validation function.
   */
  asyncValidation?: {
    functionName: string;
    debounceMs?: number;
  };
  
  // --- Options & Data Sources ---
  
  /**
   * Options for select, radio, checkbox, or multiselect fields.
   * Can be static array of strings, array of objects, or dynamic API source.
   */
  options?: string[] | FormOption[] | DynamicOptions;
  
  // --- Type-Specific Configurations ---
  
  /** Configuration for relationship/foreign key fields */
  relationshipConfig?: RelationshipConfig;
  
  /** Configuration for array fields */
  arrayConfig?: ArrayConfig;
  
  /** Configuration for file/image upload fields */
  uploadConfig?: UploadConfig;
  
  /** Configuration for computed/calculated fields */
  computedConfig?: ComputedConfig;
  
  // --- Security & Permissions ---
  
  /**
   * Required permissions to interact with this field.
   * References permission IDs from your RBAC system.
   */
  permissions?: {
    /** Permission IDs required to view this field */
    view?: string[];
    /** Permission IDs required to edit this field */
    edit?: string[];
  };
  
  // --- Metadata & Extensions ---
  
  /**
   * Arbitrary metadata for custom field behaviors or integrations.
   * Useful for tenant-specific extensions without modifying the core schema.
   */
  metadata?: Record<string, any>;
};

// ---------------------------------------------------------------------------------
// FORM STRUCTURE & LAYOUT
// ---------------------------------------------------------------------------------

/**
 * A logical grouping of fields within a section.
 * Groups help organize related fields visually and semantically.
 */
export type FormGroup = {
  /** Optional title for this group (e.g., "Basic Information") */
  title?: string;
  
  /** Optional description/help text for the entire group */
  description?: string;
  
  /** How fields within this group should be laid out */
  layout: 'row' | 'grid' | 'column';
  
  /** Number of columns for grid layout (default: 2) */
  columns?: number;
  
  /** The list of fields in this group */
  fields: FormField[];
  
  /** Conditionally show/hide the entire group */
  visibilityConditions?: ConditionalLogic;
  
  /** Make this group collapsible */
  collapsible?: boolean;
  
  /** If collapsible, is it collapsed by default */
  defaultCollapsed?: boolean;
  
  /** Required permissions to view this group */
  permissions?: {
    view?: string[];
    edit?: string[];
  };
};

/**
 * A top-level section of a form, typically rendered as a tab or a large card.
 * Sections provide the highest level of organization in a form.
 */
export type FormSection = {
  /** The title of the section (e.g., "Core Details", "Medical Information") */
  section: string;
  
  /** Optional description for the section */
  description?: string;
  
  /** Optional icon to display with the section title */
  icon?: string;
  
  /** The list of groups within this section */
  groups: FormGroup[];
  
  /** Conditionally show/hide the entire section */
  visibilityConditions?: ConditionalLogic;
  
  /** Required permissions to access this section */
  permissions?: {
    view?: string[];
    edit?: string[];
  };
  
  /** Order/position of this section (for custom sorting) */
  order?: number;
};

// ---------------------------------------------------------------------------------
// FORM ACTIONS & BEHAVIORS
// ---------------------------------------------------------------------------------

/**
 * Defines a custom action/button that can be triggered from the form.
 * Examples: Save, Save & Add Another, Clone, Send for Approval, etc.
 */
export type FormAction = {
  /** Unique identifier for this action */
  id: string;
  
  /** Display label for the button */
  label: string;
  
  /** Visual style of the button */
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  
  /** Icon to show on the button */
  icon?: string;
  
  /** Where to position the button */
  position?: 'header' | 'footer' | 'both';
  
  /** Show action only when conditions are met */
  showWhen?: ConditionalLogic;
  
  /** Disable action when conditions are met */
  disableWhen?: ConditionalLogic;
  
  /** Whether this action requires form validation to pass before executing */
  requiresValidation: boolean;
  
  /** Optional confirmation dialog before executing action */
  confirmation?: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  };
  
  /** API endpoint to call when action is triggered */
  endpoint?: string;
  
  /** HTTP method for the API call */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  /** Navigate to a different route after successful action */
  redirectTo?: string;
  
  /** Show a success message after action completes */
  successMessage?: string;
};

/**
 * General settings and behaviors for the entire form.
 */
export type FormSettings = {
  /** Show a reset/clear button */
  showResetButton?: boolean;
  
  /** Enable auto-save functionality */
  autoSave?: boolean;
  
  /** Debounce time in milliseconds for auto-save */
  autoSaveDebounceMs?: number;
  
  /** Warn user about unsaved changes when navigating away */
  warnOnUnsavedChanges?: boolean;
  
  /** Show a progress indicator for multi-section forms */
  showProgress?: boolean;
  
  /** Submit form with Enter key */
  submitOnEnter?: boolean;
  
  /** Focus first field on form mount */
  autoFocus?: boolean;
  
  /** Scroll to first error on validation failure */
  scrollToError?: boolean;
  
  /** Enable keyboard shortcuts */
  keyboardShortcuts?: {
    save?: string; // e.g., "Ctrl+S"
    cancel?: string; // e.g., "Escape"
  };
};

// ---------------------------------------------------------------------------------
// FORM CONTEXT & CONFIGURATION
// ---------------------------------------------------------------------------------

/**
 * Defines the context in which a form configuration is used.
 * Different contexts may require different fields, validations, or behaviors.
 */
export type FormContext = 
  | 'create'   // Creating a new entity
  | 'edit'     // Editing an existing entity
  | 'view'     // Read-only view of an entity
  | 'filter'   // Building filter criteria (e.g., for search/reports)
  | 'inline'   // Embedded form within another context
  | 'modal';   // Form displayed in a modal dialog

/**
 * The root configuration object for a form.
 * This defines the complete structure, validation, and behavior of a form.
 */
export type FormConfig = {
  /** The entity name this form is for (e.g., "vehicle", "passenger", "trip") */
  entity: string;
  
  /** The tenant this configuration belongs to */
  tenantId: string;
  
  /** The context in which this form configuration is used */
  context: FormContext;
  
  /** Human-readable title for the form */
  title?: string;
  
  /** Description or instructions for the entire form */
  description?: string;
  
  /** The ordered list of sections that make up the form */
  layout: FormSection[];
  
  /** Custom actions available in this form */
  actions?: FormAction[];
  
  /** General form settings and behaviors */
  settings?: FormSettings;
  
  /** Schema version for forward compatibility */
  schemaVersion?: string;
};

// ---------------------------------------------------------------------------------
// FORM CONFIGURATION STORAGE
// ---------------------------------------------------------------------------------

/**
 * Represents the database entity that stores a FormConfig for a specific tenant.
 * This entity supports versioning, audit trails, and hierarchical configuration.
 */
export interface FormConfiguration {
  id: string;
  tenantId: string; // FK to Tenant
  
  /**
   * The entity name this configuration applies to.
   * Must match one of the entity names in your system (e.g., "Vehicle", "Passenger").
   */
  entityName: string;
  
  /** The context this configuration is designed for */
  context: FormContext;
  
  /** The actual JSON configuration object that defines the form layout */
  config: FormConfig;
  
  // --- Versioning & Lifecycle ---
  
  /** Version number for this configuration (auto-incremented on updates) */
  version: number;
  
  /** Whether this configuration is currently active and should be used */
  isActive: boolean;
  
  /** Whether this is a system-provided default configuration */
  isSystemDefault: boolean;
  
  /**
   * If this config was derived/cloned from a default, reference to the source.
   * Allows tenants to "reset to default" if they break their customization.
   */
  derivedFromConfigId?: string; // FK to FormConfiguration
  
  // --- Audit Trail ---
  
  /** User ID of who created this configuration */
  createdBy: string; // FK to User
  
  /** User ID of who last updated this configuration */
  updatedBy: string; // FK to User
  
  /** Timestamp when this configuration was created */
  createdAt: ISO8601;
  
  /** Timestamp when this configuration was last updated */
  updatedAt: ISO8601;
  
  /**
   * Optional change log tracking modifications over time.
   * Useful for compliance, debugging, and rollback capabilities.
   */
  changeLog?: {
    version: number;
    changedBy: string; // FK to User
    changedAt: ISO8601;
    changeType: 'created' | 'updated' | 'cloned' | 'restored';
    /** Human-readable description of changes */
    changeDescription?: string;
    /** JSON diff or snapshot of changes for detailed tracking */
    changes?: any;
  }[];
  
  // --- Metadata ---
  
  /** Optional tags for organizing and searching configurations */
  tags?: string[];
  
  /** Notes about this configuration (e.g., "Optimized for mobile dispatch") */
  notes?: string;
}

// ---------------------------------------------------------------------------------
// FORM VALIDATION REGISTRY
// ---------------------------------------------------------------------------------

/**
 * Represents a reusable validation function that can be referenced by name.
 * This allows for custom validation logic without embedding code in JSON configs.
 */
export interface ValidationFunction {
  /** Unique name for this validation function (e.g., "validateLicensePlate") */
  name: string;
  
  /** Description of what this function validates */
  description: string;
  
  /** List of entities/fields where this validation is commonly used */
  applicableTo?: string[];
  
  /** Whether this is an async validation (e.g., checks database) */
  isAsync: boolean;
  
  /** Default error message if validation fails */
  defaultErrorMessage: string;
  
  /**
   * The actual validation function is registered in code, not stored here.
   * This entity just tracks metadata about available validation functions.
   */
}

// ---------------------------------------------------------------------------------
// HELPER TYPES & UTILITIES
// ---------------------------------------------------------------------------------

/**
 * Result of validating a FormConfig against an entity schema.
 */
export type FormConfigValidationResult = {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }[];
};

/**
 * Options for cloning a form configuration.
 */
export type CloneFormConfigOptions = {
  newTenantId: string;
  newContext?: FormContext;
  includeCustomActions?: boolean;
  resetToDefaults?: string[]; // List of field names to reset to defaults
};

// ---------------------------------------------------------------------------------
// EXAMPLE USAGE
// ---------------------------------------------------------------------------------

/**
 * Example: A complete form configuration for the Vehicle entity in 'create' context.
 * This demonstrates how all the types come together to define a rich, dynamic form.
 */
const exampleVehicleFormConfig: FormConfig = {
  entity: 'vehicle',
  tenantId: 'tenant_123',
  context: 'create',
  title: 'Create New Vehicle',
  description: 'Add a new vehicle to your fleet',
  
  layout: [
    {
      section: 'Core Details',
      icon: 'truck',
      order: 1,
      groups: [
        {
          title: 'Basic Information',
          layout: 'grid',
          columns: 2,
          fields: [
            {
              name: 'name',
              label: 'Vehicle Name',
              fieldType: 'text',
              width: 'half',
              required: true,
              placeholder: 'e.g., Van 12',
              maxLength: 50,
              tooltip: 'A friendly name to identify this vehicle'
            },
            {
              name: 'licensePlate',
              label: 'License Plate',
              fieldType: 'text',
              width: 'half',
              required: true,
              pattern: '^[A-Z0-9]{2,8}$',
              validationMessages: {
                pattern: 'License plate must be 2-8 alphanumeric characters'
              },
              customValidation: 'validateLicensePlateUnique'
            },
            {
              name: 'vehicleType',
              label: 'Vehicle Type',
              fieldType: 'select',
              width: 'half',
              required: true,
              options: [
                { value: 'sedan', label: 'Sedan', metadata: { icon: 'car' } },
                { value: 'van', label: 'Van', metadata: { icon: 'van' } },
                { value: 'wheelchair_van', label: 'Wheelchair Van', metadata: { icon: 'wheelchair' } },
                { value: 'suv', label: 'SUV', metadata: { icon: 'suv' } }
              ]
            },
            {
              name: 'homeRegionId',
              label: 'Home Region',
              fieldType: 'relationship',
              width: 'half',
              relationshipConfig: {
                entity: 'region',
                displayField: 'name',
                allowCreate: false
              },
              options: {
                sourceEntity: 'region',
                valueKey: 'id',
                labelKey: 'name',
                sortBy: { field: 'name', order: 'asc' },
                cache: { enabled: true, ttlSeconds: 600 }
              }
            }
          ]
        },
        {
          title: 'Vehicle Details',
          layout: 'grid',
          columns: 3,
          fields: [
            {
              name: 'make',
              label: 'Make',
              fieldType: 'text',
              width: 'third',
              placeholder: 'e.g., Ford'
            },
            {
              name: 'model',
              label: 'Model',
              fieldType: 'text',
              width: 'third',
              placeholder: 'e.g., Transit'
            },
            {
              name: 'year',
              label: 'Year',
              fieldType: 'number',
              width: 'third',
              min: 1990,
              max: new Date().getFullYear() + 1
            },
            {
              name: 'vin',
              label: 'VIN',
              fieldType: 'text',
              width: 'full',
              pattern: '^[A-HJ-NPR-Z0-9]{17}$',
              validationMessages: {
                pattern: 'VIN must be exactly 17 characters (excluding I, O, Q)'
              },
              tooltip: 'Vehicle Identification Number'
            }
          ]
        }
      ]
    },
    {
      section: 'Capacity & Capabilities',
      icon: 'users',
      order: 2,
      groups: [
        {
          title: 'Passenger Capacity',
          layout: 'grid',
          columns: 3,
          fields: [
            {
              name: 'capacityProfile.whc',
              label: 'Wheelchair Spaces',
              fieldType: 'number',
              width: 'third',
              min: 0,
              max: 10,
              defaultValue: 0
            },
            {
              name: 'capacityProfile.amb',
              label: 'Ambulatory Seats',
              fieldType: 'number',
              width: 'third',
              min: 0,
              max: 50,
              defaultValue: 0,
              required: true
            },
            {
              name: 'capacityProfile.str',
              label: 'Stretcher Capacity',
              fieldType: 'number',
              width: 'third',
              min: 0,
              max: 2,
              defaultValue: 0
            }
          ]
        },
        {
          title: 'Medical Capabilities',
          layout: 'column',
          visibilityConditions: {
            operator: 'OR',
            conditions: [
              { watchField: 'vehicleType', operator: 'equals', value: 'wheelchair_van' },
              { watchField: 'capacityProfile.str', operator: 'greaterThan', value: 0 }
            ]
          },
          fields: [
            {
              name: 'medicalCapabilities.levelOfService',
              label: 'Level of Service',
              fieldType: 'select',
              width: 'half',
              options: [
                { value: 'BLS', label: 'Basic Life Support (BLS)' },
                { value: 'ALS', label: 'Advanced Life Support (ALS)' },
                { value: 'CCT', label: 'Critical Care Transport (CCT)' }
              ]
            },
            {
              name: 'vehicleAttributes',
              label: 'Special Equipment',
              fieldType: 'array',
              width: 'full',
              arrayConfig: {
                itemType: 'string',
                maxItems: 10,
                options: [
                  { value: 'POWER_INVERTER', label: 'Power Inverter' },
                  { value: 'BARIATRIC_RATED', label: 'Bariatric Rated' },
                  { value: 'OXYGEN_EQUIPPED', label: 'Oxygen Equipped' }
                ]
              }
            }
          ]
        }
      ]
    }
  ],
  
  actions: [
    {
      id: 'save',
      label: 'Create Vehicle',
      variant: 'primary',
      position: 'footer',
      requiresValidation: true,
      icon: 'check',
      successMessage: 'Vehicle created successfully'
    },
    {
      id: 'saveAndAddAnother',
      label: 'Save & Add Another',
      variant: 'secondary',
      position: 'footer',
      requiresValidation: true,
      icon: 'plus'
    },
    {
      id: 'cancel',
      label: 'Cancel',
      variant: 'ghost',
      position: 'footer',
      requiresValidation: false,
      confirmation: {
        title: 'Discard changes?',
        message: 'Any unsaved changes will be lost.'
      }
    }
  ],
  
  settings: {
    showResetButton: true,
    warnOnUnsavedChanges: true,
    autoFocus: true,
    scrollToError: true,
    keyboardShortcuts: {
      save: 'Ctrl+S',
      cancel: 'Escape'
    }
  },
  
  schemaVersion: '1.0.0'
};

// =================================================================================
// SECTION 15: USER PREFERENCES & VIEW CONFIGURATION
// This section defines entities used to store user-specific UI preferences,
// such as data table column order, visibility, and sizes.
// =================================================================================

/**
 * Stores a user's customized settings for a specific table or view.
 * This allows for persisting column order, visibility, sizes, and sorting.
 */
export interface ViewConfiguration {
  id: string;
  tenantId: string; // FK to Tenant
  userId: string;   // FK to User
  
  /**
   * A unique identifier for the specific view this preference applies to.
   * e.g., "trips_unassigned_list", "vehicles_main_table", "passengers_all"
   */
  viewId: string;
  
  /**
   * Optional: The primary entity this view is for (e.g., "Trip", "Vehicle").
   * Useful for grouping preferences.
   */
  entityName?: string;
  
  /**
   * The JSON object storing the user's actual preferences.
   */
  preferences: {
    /** An ordered array of column IDs. */
    columnOrder?: string[];
    
    /** A key-value map of column visibility. */
    columnVisibility?: Record<string, boolean>;
    
    /** A key-value map of custom column sizes. */
    columnSizes?: Record<string, number>;
    
    /** The default sorting state for this view. */
    sorting?: {
      id: string;
      desc: boolean;
    }[];
  };
  
  updatedAt: ISO8601;
}