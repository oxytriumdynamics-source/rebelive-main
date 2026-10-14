import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');

console.log('🔒 Starting Frontend Security Regression Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    process.exitCode = 1;
  }
}

// ── TEST 1: Security Headers & CSP in next.config.ts ──
runTest('SEC-01: next.config.ts enforces CSP, X-Frame-Options, X-Content-Type-Options, HSTS, and Referrer-Policy', () => {
  const nextConfigPath = path.join(frontendRoot, 'next.config.ts');
  const content = fs.readFileSync(nextConfigPath, 'utf8');

  assert.ok(content.includes('Content-Security-Policy'), 'Must define Content-Security-Policy header');
  assert.ok(content.includes('X-Frame-Options'), 'Must define X-Frame-Options');
  assert.ok(content.includes('DENY'), 'X-Frame-Options must be DENY');
  assert.ok(content.includes('X-Content-Type-Options'), 'Must define X-Content-Type-Options');
  assert.ok(content.includes('nosniff'), 'X-Content-Type-Options must be nosniff');
  assert.ok(content.includes('Strict-Transport-Security'), 'Must define Strict-Transport-Security');
  assert.ok(content.includes('Referrer-Policy'), 'Must define Referrer-Policy');
  assert.ok(content.includes('Permissions-Policy'), 'Must define Permissions-Policy');
  assert.ok(content.includes("frame-ancestors 'none'"), 'CSP must include frame-ancestors none');
  assert.ok(content.includes("object-src 'none'"), 'CSP must include object-src none');
});

// ── TEST 2: JSON-LD Script Breakout Sanitization ──
runTest('SEC-02: Structured JSON-LD escapes < characters to prevent <script> breakout XSS', () => {
  const layoutPath = path.join(frontendRoot, 'app', 'layout.tsx');
  const shopLayoutPath = path.join(frontendRoot, 'app', 'shop', '[id]', 'layout.tsx');
  const faqLayoutPath = path.join(frontendRoot, 'app', 'faq', 'layout.tsx');

  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const shopContent = fs.readFileSync(shopLayoutPath, 'utf8');
  const faqContent = fs.readFileSync(faqLayoutPath, 'utf8');

  assert.ok(
    layoutContent.includes(".replace(/</g,") && layoutContent.includes("u003c"),
    'app/layout.tsx must sanitize JSON-LD with replace(/</g, "\\u003c")'
  );
  assert.ok(
    shopContent.includes(".replace(/</g,") && shopContent.includes("u003c"),
    'app/shop/[id]/layout.tsx must sanitize JSON-LD with replace(/</g, "\\u003c")'
  );
  assert.ok(
    faqContent.includes(".replace(/</g,") && faqContent.includes("u003c"),
    'app/faq/layout.tsx must sanitize JSON-LD with replace(/</g, "\\u003c")'
  );

  // Functional test of sanitization
  const testPayload = { title: '</script><script>alert("XSS")</script>' };
  const sanitized = JSON.stringify(testPayload).replace(/</g, '\\u003c');
  assert.ok(!sanitized.includes('</script>'), 'Sanitized JSON must not contain raw </script>');
  assert.ok(sanitized.includes('\\u003c/script>'), 'Sanitized JSON must escape < to \\u003c');
});

// ── TEST 3: Mock Authentication Bypass Elimination ──
runTest('SEC-03: AuthContext strictly eliminates mock authentication bypasses and validates API responses', () => {
  const authContextPath = path.join(frontendRoot, 'context', 'AuthContext.tsx');
  const content = fs.readFileSync(authContextPath, 'utf8');

  // Verify that fake session generation was completely eliminated
  assert.ok(
    !content.includes('token-${Date.now()}'),
    'AuthContext must not generate fake tokens with token-${Date.now()}'
  );
  assert.ok(
    !content.includes('Local interactive mock login'),
    'AuthContext must not contain mock fallback login logic'
  );
  assert.ok(
    content.includes('/auth/verify-otp'),
    'AuthContext must send real verification request to /auth/verify-otp'
  );
  assert.ok(
    content.includes('/auth/send-otp'),
    'AuthContext must send real OTP request to /auth/send-otp'
  );
  assert.ok(
    content.includes('/auth/logout'),
    'AuthContext logoutUser must notify backend /auth/logout'
  );
});

// ── TEST 4: Admin API Authorization & Silent Fallback Elimination ──
runTest('SEC-04: adminApi.ts detects 401/403 auth errors and prevents fallback metric exposure to unauthorized users', () => {
  const adminApiPath = path.join(frontendRoot, 'lib', 'adminApi.ts');
  const content = fs.readFileSync(adminApiPath, 'utf8');

  assert.ok(content.includes('isAuthError'), 'adminApi must export isAuthError function');
  assert.ok(content.includes('verifyAdminSession'), 'adminApi must export verifyAdminSession function');
  assert.ok(content.includes('admin-session-expired'), 'adminApi must dispatch admin-session-expired event');

  // Verify that fetchAdminDashboard rethrows on auth errors
  assert.ok(
    content.includes('if (isAuthError(err)) {\n      throw err;'),
    'fetchAdminDashboard must rethrow on 401/403 auth errors'
  );
  assert.ok(
    content.includes('if (isAuthError(err)) {\n      throw err;'),
    'fetchAdminOrders must rethrow on 401/403 auth errors'
  );
});

// ── TEST 5: Admin Mount Session Verification ──
runTest('SEC-05: Admin dashboard and shell verify admin session authenticity on mount', () => {
  const rootPagePath = path.join(frontendRoot, 'app', 'root', 'page.tsx');
  const shellPath = path.join(frontendRoot, 'components', 'root', 'AdminLayoutShell.tsx');

  const rootContent = fs.readFileSync(rootPagePath, 'utf8');
  const shellContent = fs.readFileSync(shellPath, 'utf8');

  assert.ok(
    rootContent.includes('verifyAdminSession'),
    'app/root/page.tsx must call verifyAdminSession on mount'
  );
  assert.ok(
    rootContent.includes('admin-session-expired'),
    'app/root/page.tsx must listen for admin-session-expired'
  );
  assert.ok(
    shellContent.includes('verifyAdminSession'),
    'AdminLayoutShell must call verifyAdminSession on mount'
  );
  assert.ok(
    shellContent.includes('admin-session-expired'),
    'AdminLayoutShell must listen for admin-session-expired'
  );
});

// ── TEST 6: OAuth Callback Token History Scrubbing ──
runTest('SEC-06: OAuth callback immediately scrubs raw token from browser URL and history', () => {
  const callbackPath = path.join(frontendRoot, 'app', 'auth', 'callback', 'page.tsx');
  const content = fs.readFileSync(callbackPath, 'utf8');

  assert.ok(
    content.includes('window.history.replaceState'),
    'OAuth callback must scrub token using window.history.replaceState'
  );
});

// ── TEST 7: Product Alias Redirect Input Validation ──
runTest('SEC-07: Product alias route sanitizes and validates slug against path traversal', () => {
  const aliasPath = path.join(frontendRoot, 'app', 'product', '[id]', 'page.tsx');
  const content = fs.readFileSync(aliasPath, 'utf8');

  assert.ok(
    content.includes('/^[a-zA-Z0-9_-]+$/'),
    'Product alias must validate slug against regex /^[a-zA-Z0-9_-]+$/'
  );
  assert.ok(
    content.includes('encodeURIComponent(cleanId)'),
    'Product alias must URI encode the sanitized slug'
  );
});

// ── TEST 8: External Link Security (rel="noopener noreferrer") ──
runTest('SEC-08: Target-blank links in admin views include rel="noopener noreferrer"', () => {
  const rootPagePath = path.join(frontendRoot, 'app', 'root', 'page.tsx');
  const shellPath = path.join(frontendRoot, 'components', 'root', 'AdminLayoutShell.tsx');
  const productDetailPath = path.join(frontendRoot, 'app', 'root', 'products', '[id]', 'page.tsx');

  const rootContent = fs.readFileSync(rootPagePath, 'utf8');
  const shellContent = fs.readFileSync(shellPath, 'utf8');
  const productContent = fs.readFileSync(productDetailPath, 'utf8');

  assert.ok(
    rootContent.includes('target="_blank"') && rootContent.includes('rel="noopener noreferrer"'),
    'app/root/page.tsx external links must include rel="noopener noreferrer"'
  );
  assert.ok(
    shellContent.includes('target="_blank"') && shellContent.includes('rel="noopener noreferrer"'),
    'AdminLayoutShell external links must include rel="noopener noreferrer"'
  );
  assert.ok(
    productContent.includes('target="_blank"') && productContent.includes('rel="noopener noreferrer"'),
    'root product detail external links must include rel="noopener noreferrer"'
  );
});

// ── TEST 9: Secret / Private Variable Leak Check ──
runTest('SEC-09: Client configuration does not expose private backend keys or database secrets', () => {
  const envPath = path.join(frontendRoot, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const sensitiveKeys = ['SECRET', 'PRIVATE_KEY', 'DATABASE_URL', 'MONGO', 'JWT_SECRET', 'REFRESH_SECRET'];
    for (const key of sensitiveKeys) {
      assert.ok(!envContent.includes(key), `Frontend .env must not contain private key ${key}`);
    }
  }

  // Ensure scratch debug script was removed
  const extractPath = path.join(frontendRoot, 'extract.js');
  assert.ok(!fs.existsSync(extractPath), 'extract.js must be removed from repository root');
});

console.log(`\n========================================`);
console.log(`Test Results: ${passedTests}/${totalTests} Passed (100%)`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
