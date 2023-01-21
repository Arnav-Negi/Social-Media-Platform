# Social media App - Greddiit

Website made from MERN stack

## Requirements

# Users
- 2 types of users: Moderators and regular.
- User becomes Mod of Sub Grediit made by them.
- Details
  - First name
  - Last name
  - Username
  - Email (unique)
  - Age
  - Contact number
  - Password

# Login and Registration
- A registration page for the users having appropriate fields as mentioned earlier [3
   Marks]
- Login portal redirecting to Home Page for the User [3 Marks]
- A user once logged in, should not be asked to login again even on
   website/browser/computer restart [2 Marks]
- Logout [1 Mark]
- Authentication & Authorization (tip: read about the difference on google) [5 Marks]
   - The password stored in the DB must be hashed (you can use bcrypt.js library)
   - All other pages must be accessible only after login/registration. Any attempt to
   go directly to those pages without logging in first should redirect the user to
   Auth page.
   - All the backend routes should be protected using token (you can use
   jsonwebtoken library)
- Implement Login Using Google/Facebook API [Bonus 2 Marks]
- Implement CAS Login (The College One) [Link] [Bonus 2 Marks]