# Contributing to HOTMESS LONDON

Thank you for contributing to the HOTMESS LONDON codebase! This document outlines our code standards and development workflow.

## Code Standards

### TypeScript
- TypeScript strict mode is enabled
- No `any` types without clear justification and a comment explaining why
- All components must have proper TypeScript interfaces
- Use type inference where possible, explicit types where clarity is needed

### Code Quality
- ESLint + Prettier for code formatting (configured and automated)
- Follow existing code patterns and conventions
- Keep functions small and focused
- Use meaningful variable and function names
- Add comments for complex logic or non-obvious decisions

### Component Guidelines
- Components: PascalCase (`ShopProductCard.tsx`)
- Hooks: camelCase starting with `use` (`useCart.ts`)
- Utilities: camelCase (`formatPrice.ts`)
- Constants: UPPER_SNAKE_CASE (`SHOPIFY_DOMAIN`)
- CSS classes: kebab-case or Tailwind utilities

### File Organization
- Place React components in `/src/components`
- Place hooks in `/src/hooks`
- Place utilities in `/src/lib`
- Place types in `/src/types`
- Co-locate related files when it makes sense

## Before Committing

Always run these commands before committing your changes:

```bash
# Check TypeScript types
npm run type-check

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Run the build to ensure no errors
npm run build
```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow the code standards above
   - Test your changes locally

3. **Run quality checks**
   ```bash
   npm run type-check
   npm run lint:fix
   npm run format
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Format

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add product filtering to shop page`

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Ensure all checks pass
- Request review from team members
- Respond to feedback promptly

## Need Help?

If you have questions or need help:
- Check existing documentation in `/docs`
- Review similar code in the codebase
- Ask in team chat or create an issue

Thank you for helping make HOTMESS LONDON better! 🔥
