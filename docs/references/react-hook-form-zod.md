# React Hook Form + Zod for React Native

**Last Updated**: January 2026
**Sources**:
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)

## Overview

Combining React Hook Form and Zod creates a powerful, type-safe form validation solution for React Native apps.

## Installation

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Note**: `@hookform/resolvers` is the bridge package that integrates Zod with React Hook Form.

## Basic Setup

### 1. Define Zod Schema

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

### 2. Initialize React Hook Form with Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };
}
```

### 3. Handle Inputs (React Native Pattern)

**Important**: React Native doesn't support `ref`, so use `setValue` instead of `register`.

```typescript
<TextInput
  placeholder="Email"
  onChangeText={(text) => setValue('email', text)}
  keyboardType="email-address"
/>
{errors.email && <Text>{errors.email.message}</Text>}

<TextInput
  placeholder="Password"
  onChangeText={(text) => setValue('password', text)}
  secureTextEntry
/>
{errors.password && <Text>{errors.password.message}</Text>}

<Button onPress={handleSubmit(onSubmit)} title="Login" />
```

## Benefits

- **Performance**: React Hook Form minimizes re-renders
- **Easy Validation**: Schema-based validation with Zod
- **Type Safety**: Full TypeScript integration
- **Developer Experience**: Clear error messages and validation

## Common Validation Patterns

```typescript
// Email
z.string().email()

// Min/Max length
z.string().min(6).max(20)

// Optional field
z.string().optional()

// Number validation
z.number().min(18).max(100)

// Custom validation
z.string().refine((val) => val.includes('@'), {
  message: 'Must contain @',
})

// Conditional validation
z.object({
  hasPartner: z.boolean(),
  partnerName: z.string().optional(),
}).refine(
  (data) => !data.hasPartner || data.partnerName,
  { message: 'Partner name required', path: ['partnerName'] }
)
```

## Best Practices

1. **Define schemas separately**: Reusable validation logic
2. **Use TypeScript inference**: `z.infer<typeof schema>` for type safety
3. **Show errors inline**: Display validation errors next to inputs
4. **Debounce validation**: For expensive validations
5. **Use Controller**: For complex custom inputs

## Controller Pattern (for Custom Components)

```typescript
import { Controller } from 'react-hook-form';

<Controller
  control={control}
  name="email"
  render={({ field: { onChange, value } }) => (
    <CustomInput
      value={value}
      onChangeText={onChange}
      error={errors.email?.message}
    />
  )}
/>
```

## Sources

- [React Hook Form + Zod Tutorial](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/)
- [React Native Form Validation Guide](https://medium.com/@rutikpanchal121/building-a-robust-form-in-react-native-with-react-hook-form-and-zod-for-validation-7583678970c3)
- [GitHub Example](https://github.com/tarikfp/rn-zod-react-hook-form)
