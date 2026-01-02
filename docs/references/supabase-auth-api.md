# Supabase Auth API Reference (2025)

**Source**: [JavaScript API Reference - signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) | [Password-based Auth Guide](https://supabase.com/docs/guides/auth/passwords)

**Last Updated**: 2026-01-02

---

## signInWithPassword()

Sign in a user with email/password or phone/password.

### Email + Password

```typescript
async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'valid.email@supabase.io',
    password: 'example-password',
  });

  if (error) {
    console.error('Error signing in:', error.message);
    return;
  }

  console.log('User:', data.user);
  console.log('Session:', data.session);
}
```

**Response**:
```typescript
{
  data: {
    user: {
      id: 'uuid',
      email: 'valid.email@supabase.io',
      email_confirmed_at: '2026-01-02T10:00:00Z',
      user_metadata: {},
      created_at: '2026-01-02T09:00:00Z',
      // ...
    },
    session: {
      access_token: 'jwt-token',
      refresh_token: 'refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: { /* same as above */ }
    }
  },
  error: null
}
```

### Phone + Password

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  phone: '+13334445555',
  password: 'some-password',
});
```

---

## signUp()

Register a new user with email/password or phone/password.

### Email Signup

```typescript
async function signUpWithEmail() {
  const { data, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'secure-password-123',
    options: {
      data: {
        display_name: 'John Doe',
        // Any custom user metadata
      },
      emailRedirectTo: 'myapp://auth/callback', // For mobile deep linking
    },
  });
}
```

### Phone Signup (OTP)

**Step 1: Request OTP**
```typescript
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+84901234567',
});
```

**Step 2: Verify OTP**
```typescript
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+84901234567',
  token: '123456',
  type: 'sms',
});
```

---

## signOut()

Sign out the current user and invalidate session.

```typescript
async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  }
}
```

---

## getSession()

Get the current session (if exists).

```typescript
async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    console.log('Access token:', session.access_token);
    console.log('Expires at:', new Date(session.expires_at * 1000));
  }

  return session;
}
```

---

## getUser()

Get the current user (requires valid session).

```typescript
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (user) {
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
  }

  return user;
}
```

---

## onAuthStateChange()

Listen for authentication state changes.

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event);

    switch (event) {
      case 'SIGNED_IN':
        console.log('User signed in:', session?.user);
        break;
      case 'SIGNED_OUT':
        console.log('User signed out');
        break;
      case 'TOKEN_REFRESHED':
        console.log('Token refreshed:', session?.access_token);
        break;
      case 'USER_UPDATED':
        console.log('User updated:', session?.user);
        break;
    }
  }
);

// Unsubscribe when component unmounts
subscription.unsubscribe();
```

**Events**:
- `SIGNED_IN` - User successfully signed in
- `SIGNED_OUT` - User signed out
- `TOKEN_REFRESHED` - Access token refreshed
- `USER_UPDATED` - User metadata updated
- `PASSWORD_RECOVERY` - Password reset requested

---

## updateUser()

Update user metadata or password.

```typescript
// Update user metadata
const { data, error } = await supabase.auth.updateUser({
  data: { display_name: 'New Name' }
});

// Update password
const { data, error } = await supabase.auth.updateUser({
  password: 'new-password-123'
});

// Update email (requires confirmation)
const { data, error } = await supabase.auth.updateUser({
  email: 'new-email@example.com'
});
```

---

## resetPasswordForEmail()

Send password reset email.

```typescript
async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'myapp://auth/reset-password',
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Password reset email sent!');
  }
}
```

---

## OAuth Providers

### Sign in with OAuth

```typescript
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'myapp://auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}
```

**Supported Providers**:
- `google`
- `facebook`
- `apple`
- `github`
- `twitter`
- `discord`
- And more...

---

## Error Handling

### Common Errors

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'wrong-password',
});

if (error) {
  switch (error.message) {
    case 'Invalid login credentials':
      // Wrong email/password
      break;
    case 'Email not confirmed':
      // User hasn't verified email
      break;
    case 'User already registered':
      // Duplicate signup
      break;
    default:
      console.error('Auth error:', error.message);
  }
}
```

### WeakPasswordError

If password doesn't meet requirements:
```typescript
{
  error: {
    message: "Password should be at least 6 characters",
    code: "weak_password"
  }
}
```

---

## Important Notes (2025)

1. **Deprecated Methods**:
   - ❌ `supabase.auth.signIn()` → Use `signInWithPassword()` or `signInWithOtp()`
   - ❌ `supabase.auth.api.signInWithEmail()` → Use `signInWithPassword()`

2. **Session Management**:
   - Sessions expire after 1 hour (configurable)
   - Refresh tokens valid for 7 days (default)
   - Auto-refresh enabled by default

3. **Security**:
   - Always use HTTPS in production
   - Store tokens securely (AsyncStorage for React Native)
   - Never expose `service_role` key in client apps

---

## Sources

- [JavaScript API Reference - signInWithPassword](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Password-based Auth Guide](https://supabase.com/docs/guides/auth/passwords)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Password Security](https://supabase.com/docs/guides/auth/password-security)
