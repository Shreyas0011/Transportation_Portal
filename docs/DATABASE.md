# Database Schema Reference

## MongoDB Collections

### users
| Field | Type | Notes |
|-------|------|-------|
| email | String | unique, required |
| password | String | required — plain text for now; hash in production |
| role | String | Super Admin / Transport Head / Driver / Parent |
| name | String | required |
| employeeId | String | for staff |
| studentId | String | for parents (links to student) |
| isActive | Boolean | default: true |

### drivers
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| employeeId | String | unique, required |
| phone | String | required |
| assignedVehicle | String | vehicle number |
| assignedRoute | String | route name |
| status | String | Active / On-Leave / Inactive |

### vehicles
| Field | Type | Notes |
|-------|------|-------|
| vehicleNumber | String | unique, required |
| registrationNumber | String | |
| vehicleModel | String | |
| seatingCapacity | Number | |
| driverAssigned | String | driver name |
| routeAssigned | String | route name |
| status | String | Active / Maintenance / Inactive |

### routes
| Field | Type | Notes |
|-------|------|-------|
| routeName | String | unique, required |
| startingPoint | String | |
| destination | String | |
| assignedVehicle | String | |
| assignedDriver | String | |
| stops | Array | [{stopName, arrivalTime, dropTime}] |

### students
| Field | Type | Notes |
|-------|------|-------|
| studentName | String | required |
| studentId | String | unique, required |
| route | String | default: None |
| bus | String | default: None |
| pickupStop | String | default: None |
| dropStop | String | default: None |
| parentContact | String | required |
| parentEmail | String | |
| healthRecord | String | |

### attendances
| Field | Type | Notes |
|-------|------|-------|
| id | String | unique — ATT-{studentId}-{date} |
| date | String | YYYY-MM-DD |
| studentId | String | |
| studentName | String | |
| route | String | |
| bus | String | |
| status | String | Present / Absent / Boarded / Dropped / No-Show |
| parentDeclaration | String | Present / Absent |
| updatedBy | String | |
| dropOffTime | String | 3:30 PM / 5:30 PM / 12:30 PM |

### notifications
| Field | Type | Notes |
|-------|------|-------|
| id | String | unique |
| title | String | |
| category | String | |
| message | String | |
| date | String | |
| sentBy | String | |

### fastaglog
| Field | Type | Notes |
|-------|------|-------|
| id | String | unique |
| vehicleNumber | String | |
| gateName | String | |
| direction | String | Entry / Exit |
| timestamp | String | ISO |
| status | String | Valid / Invalid |

### safetyalerts
| Field | Type | Notes |
|-------|------|-------|
| id | String | unique |
| vehicleNumber | String | |
| type | String | |
| severity | String | |
| timestamp | String | ISO |
| resolved | Boolean | default: false |
