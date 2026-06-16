# SHC Reusable Components

SHC v1 is useful as a reference app, not as code to blindly copy. The best AppNow extraction path is to convert SHC patterns into templates.

## Frontend Components To Reuse

### Auth Session Shell

Source idea:

- `AuthProvider`
- token storage
- current user fetch
- logout
- delete account
- provider-specific login handlers

AppNow template:

```txt
templates/frontend/auth/
  AuthProvider.tsx
  authTypes.ts
  tokenStorage.ts
  authClient.ts
```

Reusable because almost every generated app needs the same lifecycle:

```txt
restore token
fetch /users/me
route by role
logout
delete account
```

### Role-Based Navigation

Source idea:

- normal user stack
- admin stack
- loading state while checking user

AppNow template:

```txt
templates/frontend/navigation/
  AppNavigator.tsx
  userRoutes.ts
  adminRoutes.ts
  routeTypes.ts
```

V2 fix:

- Keep route types out of the navigator file.
- Keep data/domain types out of navigation.
- Generate route groups from app spec.

### Admin CRUD List Screen

Source idea:

- user list
- booking list
- filter
- status update
- delete
- role toggle

AppNow template:

```txt
templates/frontend/admin/
  AdminDashboardScreen.tsx
  AdminListScreen.tsx
  AdminDetailScreen.tsx
  StatusPill.tsx
  ConfirmAction.tsx
```

Reusable for:

- users
- orders
- bookings
- requests
- listings
- support tickets

### Address Search Flow

Source idea:

- Kakao address search
- result picker
- detail address input
- callback into caller

AppNow template:

```txt
templates/frontend/integrations/kakao-address/
  AddressSearchScreen.tsx
  kakaoAddressClient.ts
  addressTypes.ts
```

Keep it optional. This is Korea-specific and very valuable for service/booking apps.

### Booking Wizard

Source idea:

```txt
category
subtype
service type
tier
options
date/time
confirmation
history
detail
```

AppNow template:

```txt
templates/frontend/workflows/booking/
  BookingMenuScreen.tsx
  BookingSelectScreen.tsx
  BookingConfirmScreen.tsx
  BookingHistoryScreen.tsx
  BookingDetailScreen.tsx
```

V2 fix:

- Make steps data-driven.
- Keep pricing/tier/option rules in config.
- Keep all API calls behind clients/hooks.

## Backend Components To Reuse

### Auth Middleware

Source idea:

- JWT verification
- `req.user`
- admin guard
- provider flags

AppNow template:

```txt
templates/backend/auth/
  authMiddleware.ts
  authRoutes.ts
  authController.ts
  jwt.ts
  password.ts
```

V2 fix:

- Validate env at boot.
- Use one canonical user id.
- Keep auth errors consistent.

### Admin CRUD Pattern

Source idea:

- `/api/admin/users`
- `/api/admin/bookings`
- role update
- status update
- delete
- filtering

AppNow template:

```txt
templates/backend/admin-crud/
  adminRouter.ts
  makeCrudController.ts
  filters.ts
  permissions.ts
```

This is one of the highest-value AppNow patterns.

### Booking Initialize Endpoint

Source idea:

One endpoint prepares all frontend data:

```txt
subtypes
service types
options
pricing
assets
timeslots
```

AppNow template:

```txt
templates/backend/initialize/
  initializeController.ts
  initializeRoutes.ts
```

Reusable as:

```txt
GET /api/app/initialize
```

For generated apps, this endpoint can return:

```txt
current user
feature flags
select options
catalog data
pricing data
settings
```

### Kakao Integration

Source idea:

- Kakao login
- profile verification
- shipping address
- address search
- account unlink

AppNow template:

```txt
templates/backend/integrations/kakao/
  kakaoAuthController.ts
  kakaoAddressController.ts
  kakaoService.ts
```

Keep optional and isolated.

### Mongo Model Pattern

Source idea:

- flexible schema
- service/catalog models
- booking model
- user model

AppNow template:

```txt
templates/backend/mongo/
  modelFactory.ts
  objectId.ts
  timestamps.ts
```

V2 fix:

- Avoid mixing `_id` and numeric `userId` as relationship keys.
- Add indexes.
- Keep enums in shared constants.

## Immediate AppNow Extraction Priority

1. Auth session shell.
2. Admin CRUD.
3. Initialize endpoint.
4. Booking workflow.
5. Kakao address/search.
6. Mongo model generator.

Do not extract Apple login as a core module yet. Treat it as optional compliance/auth-provider support.
