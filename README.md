# Links Creation using Vercel + Supabase Proof of Concept

## Useful Links
- [GitHub Repository](https://github.com/macaoffice93/supabase-linker)
- [Production Vercel Deployment](https://supabase-links.vercel.app/)

## Requirements
1. Generate multiple unique links, each with a distinct subdomain.
2. Configure the data each link retrieves individually.
3. Protect all configuration settings from unauthorized access.
4. Create multiple links simultaneously.

## Technology Stack
- **Next.js Application**: Full-stack framework for frontend and backend functionality.
- **Supabase**: PostgreSQL database and authentication integration.
- **Vercel**: Hosting and serverless functions.
- **GitHub Actions**: Continuous deployment (CD) workflows.

## Solution Overview
1. **Next.js Application**:
   - Handles both frontend and backend functionality.
   - Utilizes cloud functions for backend logic.

2. **Supabase PostgreSQL Database**:
   - Stores data related to link configurations.

3. **Supabase Authentication**:
   - Secures data and backend endpoints, ensuring only authorized access.

4. **Vercel Hosting**:
   - Hosts the application and generates unique subdomain links using Vercel's preview links feature.

5. **GitHub Actions**:
   - Automates link creation and configuration through workflows.
   - Enables users to trigger workflows to configure or update link settings.

## Example Workflows
### 1. Generating New Links
- Users can create one or more links by executing the `deploy.yml` workflow.
- **Parameters**: Number of links (e.g., 3).
- **Result**: Generates the specified number of links and displays details about each link and its default configuration.

### 2. Configuring a Link
- Users can configure a link with new values by executing the `call-auth-endpoint.yml` workflow.
- **Parameters**:
  - `URL`: The link URL to configure.
  - `Configuration Value`: The new configuration value.
- **Result**: Updates the link's configuration.

### 3. Retrieving Link Configuration
- Query the `/api/config` endpoint of the link to retrieve its configuration.

## Behind the Scenes
- **Deployments Table**: Stores deployment information, including URLs and configuration values.
- **Modifying Configuration**: 
  - Update configurations via `/api/deployments/update-config` with a valid JWT token.
  - Authenticate using the `/api/auth` endpoint.

## API Documentation
### POST `/api/auth`
- **Description**: Authenticates users with email and password via Supabase.
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <JWT token>`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }

### GET `/api/config`
**Description**: Retrieves or initializes configuration settings for a deployment based on its URL.

**Parameters**:
- `url`: The URL of the deployment.

---

### POST `/api/deployments/update-config`
**Description**: Updates configuration settings for a deployment.

**Headers**:
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <JWT token>`

**Request Body**:
```json
{
  "url": "https://your-deployment-url.com",
  "config": "{\"featureEnabled\": true, \"theme\": \"dark\"}"
}
```
## Gotchas and Future Improvements

1. **Supabase Free Plan**:
   - Free plans pause after a week of inactivity. Regular queries are needed to keep the project active.

2. **Vercel Webhooks**:
   - Could replace parts of the `deploy.yml` workflow but requires a Pro or Enterprise plan.

3. **Frontend Considerations**:
   - Add a frontend page for configuration management.
   - Alternatively, minimize frontend functionality.

4. **User Access Management**:
   - Manage user access directly via Supabase.

---

## Conclusion
This proof of concept integrates Vercel, Supabase, and GitHub Actions to automate the creation, configuration, and management of unique links with secure configurations.
---
## Telegram bot integration
Visit [GitHub Repository](https://github.com/macaoffice93/telegram-bot-linker)