# SHC Reusable Components For AppNow

SHC v1 should be treated as a reference implementation, not a visual template.
The useful value is in its workflows, data contracts, integrations, and admin
operations. Do not copy its gradients, icon-card navigation, scattered styles,
asset paths, or corrupted strings.

Source repos:

- `tsar-b/smart-homecare-frontend-v1`
- `tsar-b/smart-homecare-backend-v1`

Local analysis snapshot:

- Frontend: Expo React Native, about 4,809 source lines, 16 screens.
- Backend: Express/TypeScript/Mongo, about 1,508 source lines, 20 TS files.
- Backend build passes.
- Frontend and backend both need dependency/security cleanup before production
  reuse.

## Extraction Rule

For AppNow, extract these as generators:

```txt
product workflow -> app spec
app spec -> frontend module + backend module + database schema + seed plan
```

Do not extract SHC as copied files. Extract it as reusable modules with clean
contracts.

## Priority Map

| Priority | Module | Why it matters |
| --- | --- | --- |
| 1 | Auth session shell | Every generated app needs identity, restore, logout, role routing. |
| 2 | Admin CRUD | Highest reuse across booking, CRM, requests, listings, users. |
| 3 | Catalog initialize endpoint | Lets generated apps boot with one stable payload. |
| 4 | Booking/request workflow | Reusable service-business workflow. |
| 5 | Korea address integration | High value for Korean service apps. |
| 6 | Status/timeline history | Reusable customer/admin operational surface. |
| 7 | Data migration bridge | Turns old app data into AppNow seed/import plans. |

## 1. Auth Session Shell

Source files:

```txt
frontend/src/context/AuthContext.tsx
frontend/src/services/services.ts
backend/src/controllers/apiController.ts
backend/src/controllers/oAuthController.ts
backend/src/middleware/authMiddleware.ts
backend/src/models/User.ts
```

Reusable behaviors:

- Restore token from secure storage.
- Fetch current user with `GET /api/users/me`.
- Support standard, guest, Kakao, and Apple providers.
- Route admin users to admin screens.
- Delete account and clean local session.
- Track provider-specific missing data, such as Kakao phone fallback.

AppNow template target:

```txt
templates/frontend/auth/
  AuthProvider.tsx
  authClient.ts
  authStorage.ts
  authTypes.ts
  useAuthSession.ts

templates/backend/auth/
  auth.controller.ts
  auth.routes.ts
  auth.middleware.ts
  jwt.ts
  password.ts
  providerRegistry.ts
```

Rewrite requirements:

- Use one canonical user id. SHC mixes Mongo `_id`, numeric `userId`, and
  provider ids.
- Keep JWT payload minimal: `sub`, `role`, `provider`, `sessionVersion`.
- Validate env at boot.
- Return typed API errors with stable codes.
- Generate provider modules only when enabled in the app spec.

Do not copy:

- Literal string bugs such as `'${API}/register'`.
- Provider logic embedded directly in the context component.
- Corrupted Korean strings.

## 2. Role-Based Navigation

Source files:

```txt
frontend/src/navigation/AppNavigator.tsx
frontend/src/screens/admin/*
frontend/src/screens/HomeScreen.tsx
frontend/src/screens/SettingsScreen.tsx
```

Reusable behaviors:

- Show loading state while token/user is restored.
- Split normal-user routes from admin routes.
- Hide or show flows by role.

AppNow template target:

```txt
templates/frontend/navigation/
  AppRouter.tsx
  routeRegistry.ts
  userRoutes.ts
  adminRoutes.ts
  routeTypes.ts
```

Rewrite requirements:

- Generate routes from app spec.
- Keep domain types out of navigation files.
- Support web desktop layout and mobile navigation separately.

## 3. Admin CRUD

Source files:

```txt
frontend/src/screens/admin/AdminDashboard.tsx
frontend/src/screens/admin/AdminUsers.tsx
frontend/src/screens/admin/AdminBookingList.tsx
frontend/src/screens/admin/AdminSettings.tsx
backend/src/controllers/adminController.ts
backend/src/routes/adminRoutes.ts
```

Reusable behaviors:

- Admin dashboard landing screen.
- List users.
- Toggle admin role.
- Delete users.
- Filter bookings by date range.
- Change booking status and price.
- Copy customer address.
- Open booking detail.

AppNow template target:

```txt
templates/frontend/admin/
  AdminLayout.tsx
  AdminResourceList.tsx
  AdminResourceDetail.tsx
  ResourceFilters.tsx
  StatusPill.tsx
  ConfirmAction.tsx

templates/backend/admin-crud/
  admin.routes.ts
  createCrudController.ts
  filters.ts
  permissions.ts
  auditLog.ts
```

Generalize as:

```json
{
  "resources": [
    {
      "name": "bookings",
      "label": "Bookings",
      "statusField": "status",
      "dateField": "reservationDate",
      "adminActions": ["list", "filter", "updateStatus", "delete"]
    }
  ]
}
```

Rewrite requirements:

- Use pagination, not unlimited `find()`.
- Do server-side filtering/sorting.
- Add audit logging for destructive actions.
- Add typed status enums per generated app.
- Avoid N+1 user lookup; use joins/views in Supabase or batched queries.

## 4. Booking / Request Workflow

Source files:

```txt
frontend/src/screens/BookingMenu.tsx
frontend/src/screens/BookingServiceSelect.tsx
frontend/src/screens/BookingSubtypeSelect.tsx
frontend/src/screens/BookingExplanation.tsx
frontend/src/screens/BookingConfirm.tsx
frontend/src/screens/HistoryScreen.tsx
frontend/src/screens/BookingDetailScreen.tsx
backend/src/controllers/bookingController.ts
backend/src/controllers/apiController.ts
backend/src/models/bookingModel.ts
backend/src/models/applianceModel.ts
backend/src/models/timeslotModel.ts
```

Reusable behaviors:

- Choose category.
- Choose service type.
- Choose subtype/device/product.
- Choose tier.
- Choose add-on options.
- Add symptom/memo for repair-like flows.
- Calculate price as base tier plus option extras.
- Choose date and available time slot.
- Submit booking/request.
- Show user history and detail.

AppNow template target:

```txt
templates/frontend/workflows/request-booking/
  RequestWizard.tsx
  StepCategory.tsx
  StepService.tsx
  StepOptions.tsx
  StepSchedule.tsx
  RequestConfirm.tsx
  RequestHistory.tsx
  RequestDetail.tsx
  pricing.ts

templates/backend/workflows/request-booking/
  request.routes.ts
  request.controller.ts
  availability.service.ts
  pricing.service.ts
  request.schema.ts
```

App spec shape:

```json
{
  "workflow": "request-booking",
  "catalog": {
    "categories": ["aircon"],
    "serviceTypes": ["clean", "install", "fix", "sell"],
    "tiers": ["standard", "deluxe", "premium"],
    "options": [
      {
        "key": "extra_part",
        "label": "Extra part",
        "choices": [
          { "value": "none", "label": "None", "extraCost": 0 }
        ]
      }
    ]
  }
}
```

Rewrite requirements:

- Make wizard steps data-driven.
- Keep pricing rules in a shared module.
- Keep scheduling rules server-authoritative.
- Prevent double booking with a database-level unique constraint.
- Add timezone handling.

Do not copy:

- Hardcoded category cards.
- Manual route reset behavior for every back action.
- Date comparisons that rely only on local device time.

## 5. Catalog Initialize Endpoint

Source files:

```txt
backend/src/controllers/bookingController.ts
backend/src/models/applianceModel.ts
frontend/src/screens/BookingExplanation.tsx
```

Reusable behavior:

One endpoint hydrates the frontend with:

```txt
subtypes
service types
pricing tiers
options
blueprint/part assets
time slots
```

AppNow template target:

```txt
templates/backend/initialize/
  initialize.routes.ts
  initialize.controller.ts
  initialize.serializer.ts

templates/frontend/initialize/
  useInitializeApp.ts
  initializeClient.ts
  initializeTypes.ts
```

Generated endpoint:

```txt
GET /api/app/initialize
```

Return payload:

```json
{
  "currentUser": null,
  "featureFlags": {},
  "catalog": {},
  "settings": {},
  "localization": {}
}
```

Rewrite requirements:

- Cache the response.
- Version the payload.
- Make optional modules appear only when enabled.
- Keep assets as metadata, not local hardcoded imports.

## 6. Korea Address Module

Source files:

```txt
frontend/src/screens/AddressSearchScreen.tsx
backend/src/controllers/oAuthController.ts
backend/src/services/kakaoService.ts
```

Reusable behaviors:

- Search Kakao road address API.
- Expand road-only results by trying numbered variants.
- Select base address plus detail address.
- Return selected address to caller.
- Optionally use Kakao shipping address during login.

AppNow template target:

```txt
templates/frontend/integrations/kakao-address/
  AddressSearch.tsx
  kakaoAddressClient.ts
  addressTypes.ts

templates/backend/integrations/kakao-address/
  kakaoAddress.routes.ts
  kakaoAddress.controller.ts
  kakaoAddress.client.ts
```

Rewrite requirements:

- Debounce search.
- Normalize road/parcel address fields.
- Keep API keys server-side.
- Add rate limiting.
- Make this module Korea-only and optional.

## 7. Provider Login Modules

Source files:

```txt
frontend/src/screens/LoginScreen.tsx
backend/src/controllers/oAuthController.ts
backend/src/services/kakaoService.ts
backend/src/services/appleService.ts
```

Reusable behaviors:

- Kakao native login.
- Kakao profile verification server-side.
- Kakao unlink/delete path.
- Apple token verification.

AppNow template target:

```txt
templates/backend/integrations/kakao-auth/
templates/backend/integrations/apple-auth/
templates/frontend/integrations/kakao-auth/
templates/frontend/integrations/apple-auth/
```

Priority:

1. Kakao address search.
2. Kakao login.
3. Apple login.

Reason: address search is more reusable for Korean service apps than Apple
login.

## 8. Data Models Worth Generalizing

Source files:

```txt
backend/src/models/User.ts
backend/src/models/bookingModel.ts
backend/src/models/applianceModel.ts
backend/src/models/timeslotModel.ts
backend/src/models/Counter.ts
```

Reusable model ideas:

- `User`: identity, contact info, provider, role, address.
- `Request` or `Booking`: customer, schedule, status, price, options.
- `CatalogCategory`: product/service grouping.
- `ServiceType`: action the business performs.
- `Subtype`: item/device/product the action applies to.
- `PricingTier`: tier and base price.
- `Option`: user-selectable add-ons with extra cost.
- `Asset`: blueprint, part, video, manual.
- `TimeSlot`: available times.

AppNow Supabase target:

```txt
users
requests
catalog_categories
catalog_items
service_types
pricing_tiers
request_options
assets
time_slots
```

Rewrite requirements:

- Prefer UUID primary keys for generated apps.
- Keep legacy ids in `legacy_*` columns only.
- Add unique constraints and indexes.
- Normalize status enums per app.
- Add migration metadata columns: `legacy_id`, `migration_source`,
  `migrated_at`.

## 9. API Client Pattern

Source files:

```txt
frontend/src/services/services.ts
many screens with direct axios calls
```

Reusable behavior:

- Centralize auth headers.
- Keep API base URL in one place.
- Return typed payloads.

AppNow template target:

```txt
templates/frontend/api/
  apiClient.ts
  authClient.ts
  requestClient.ts
  adminClient.ts
  catalogClient.ts
```

Rewrite requirements:

- No direct `axios` calls from screens.
- No `process.env` reads from feature components.
- Use generated endpoint clients from app spec.
- Add request timeout and friendly error mapping.

## 10. Migration And Seed Value

SHC is useful as seed material for AppNow's migration engine:

- Mongo model discovery.
- Collection-to-Supabase table mapping.
- Approved-status filtering.
- Generated seed plans.
- Reusable catalog extraction.

AppNow target:

```txt
src/pipeline/
templates/backend/
database/automation/
```

Useful migration patterns:

- Generate table SQL from mappings.
- Generate starter RLS.
- Generate import order.
- Keep dry-run mode.
- Write JSON artifacts before upload.

## Things To Explicitly Reject

Do not carry these into AppNow:

- Visual design.
- Hardcoded asset paths.
- Mixed `_id` / `userId` relations.
- Corrupted Korean strings.
- Direct API calls inside screens.
- Repeated bottom nav in every screen.
- `fsevents: file:latest`.
- Root-level `eas-cli` dependency in the app runtime package.
- Unbounded admin `find()` calls.
- Missing unique slot constraint for bookings.
- Optional provider integrations in the core template.

## First AppNow Generator Milestone

Build these first:

```txt
1. app spec for service-booking
2. generated Supabase schema
3. generated backend request/auth/admin modules
4. generated React desktop admin shell
5. generated React Native customer flow later
```

Minimum generated app should include:

- Auth: standard + guest.
- Admin: users + requests.
- Catalog: category, service type, item, pricing tier, option.
- Request flow: create, schedule, history, admin status.
- Korea module optional: Kakao address.

This gives AppNow reusable product value without inheriting SHC's old design.
