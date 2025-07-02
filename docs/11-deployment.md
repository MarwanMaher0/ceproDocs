# Deployment & Scaling

## 🚀 Production Deployment

### Build Configuration

#### Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://api.cepro.ai/api/v1
VITE_APP_NAME=Cepro.ai
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
VITE_ANALYTICS_ID=GA-XXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Security headers
VITE_CSP_NONCE=random-nonce-value
VITE_HSTS_MAX_AGE=31536000
```

#### Production Build Script
```json
{
  "scripts": {
    "build:production": "NODE_ENV=production vite build",
    "build:staging": "NODE_ENV=staging vite build",
    "build:analyze": "vite build --analyze",
    "preview": "vite preview --port 4173"
  }
}
```

#### Vite Production Configuration
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    build: {
      // Minification
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      
      // Source maps (disabled in production for security)
      sourcemap: !isProduction,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Manual chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            ui: ['@headlessui/vue', 'tippy.vue'],
            charts: ['apexcharts', 'vue3-apexcharts'],
            utils: ['axios', 'lodash-es', 'date-fns'],
          },
          // File naming for caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  };
});
```

---

## 🌐 Server Configuration

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/cepro-frontend
server {
    listen 80;
    listen [::]:80;
    server_name cepro.ai www.cepro.ai;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cepro.ai www.cepro.ai;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/cepro.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cepro.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # CSP Header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.cepro.ai;";
    
    # Root directory
    root /var/www/cepro-frontend/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Brotli compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Cache HTML with shorter expiry
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # API proxy
    location /api/ {
        proxy_pass https://api.cepro.ai;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://cepro.ai";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }
    
    # Vue Router (SPA) support
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Apache Configuration (Alternative)
```apache
# .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle SPA routing
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

---

## 🐳 Docker Deployment

### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN yarn build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy environment script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    container_name: cepro-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
      - VITE_API_BASE_URL=https://api.cepro.ai/api/v1
    volumes:
      - ./ssl:/etc/ssl/certs:ro
      - ./logs:/var/log/nginx
    networks:
      - cepro-network
    depends_on:
      - backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`cepro.ai`)"
      - "traefik.http.routers.frontend.tls=true"

  backend:
    image: cepro/backend:latest
    container_name: cepro-backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/cepro
    networks:
      - cepro-network

networks:
  cepro-network:
    driver: bridge
```

### Environment Injection Script
```bash
#!/bin/sh
# docker-entrypoint.sh

# Replace environment variables in built files
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|VITE_API_BASE_URL_PLACEHOLDER|$VITE_API_BASE_URL|g" {} \;
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|VITE_APP_NAME_PLACEHOLDER|$VITE_APP_NAME|g" {} \;

# Start nginx
exec "$@"
```

---

## ☁️ Cloud Deployment

### AWS S3 + CloudFront
```bash
#!/bin/bash
# deploy-aws.sh

# Build the application
npm run build

# Sync to S3 bucket
aws s3 sync dist/ s3://cepro-frontend-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
    --distribution-id E1234567890123 \
    --paths "/*"
```

#### CloudFront Configuration
```json
{
  "DistributionConfig": {
    "CallerReference": "cepro-frontend-2024",
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "Id": "S3-cepro-frontend",
          "DomainName": "cepro-frontend-bucket.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": "origin-access-identity/cloudfront/E1234567890123"
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-cepro-frontend",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "managed-caching-optimized"
    },
    "CustomErrorResponses": {
      "Quantity": 1,
      "Items": [
        {
          "ErrorCode": 404,
          "ResponsePagePath": "/index.html",
          "ResponseCode": "200",
          "ErrorCachingMinTTL": 300
        }
      ]
    },
    "ViewerCertificate": {
      "AcmCertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012",
      "SSLSupportMethod": "sni-only"
    }
  }
}
```

### Vercel Deployment
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify Deployment
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete
      
      - name: Invalidate CloudFront
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run type-check
    - npm run lint
    - npm run test:coverage
  coverage: '/Coverage: \d+\.\d+/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
  only:
    - main

deploy:production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $DEPLOY_WEBHOOK_URL
  environment:
    name: production
    url: https://cepro.ai
  only:
    - main
  when: manual
```

---

## 📊 Performance Monitoring

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Generate bundle report
npx webpack-bundle-analyzer dist/assets/*.js
```

### Lighthouse CI
```yaml
# lighthouse-ci.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Web Vitals Monitoring
```typescript
// utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initWebVitals() {
  if (import.meta.env.PROD) {
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getFCP(sendToAnalytics);
    getLCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
}

function sendToAnalytics(metric: any) {
  // Send to Google Analytics
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
  
  // Send to custom analytics
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## 🔧 Scaling Considerations

### CDN Strategy
```typescript
// CDN configuration for assets
const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL;

export const getAssetUrl = (path: string): string => {
  if (import.meta.env.PROD && CDN_BASE_URL) {
    return `${CDN_BASE_URL}${path}`;
  }
  return path;
};
```

### Code Splitting Strategies
```typescript
// Route-based splitting
const Dashboard = () => import('@/views/Dashboard.vue');
const Users = () => import('@/views/Users/index.vue');

// Feature-based splitting
const ChartingModule = () => import('@/modules/charting');
const ReportingModule = () => import('@/modules/reporting');

// Component-based splitting
const HeavyComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyComponent.vue'),
  loadingComponent: () => import('@/components/LoadingSpinner.vue'),
  delay: 200,
  timeout: 3000,
});
```

### Progressive Loading
```typescript
// Progressive image loading
export function useProgressiveImage(src: string) {
  const loaded = ref(false);
  const error = ref(false);
  
  const image = new Image();
  image.onload = () => { loaded.value = true; };
  image.onerror = () => { error.value = true; };
  image.src = src;
  
  return { loaded, error };
}
```

---

## 🔒 Security Hardening

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.cepro.ai;
  frame-ancestors 'none';
">
```

### Environment Secrets Management
```bash
# Use secret management tools
export VITE_API_BASE_URL=$(aws ssm get-parameter --name "/cepro/api-url" --query "Parameter.Value" --output text)
export VITE_ANALYTICS_ID=$(vault kv get -field=analytics_id secret/cepro)
```

---

## 📈 Monitoring & Alerting

### Error Tracking with Sentry
```typescript
// sentry.ts
import * as Sentry from '@sentry/vue';

export function initSentry(app: App) {
  if (import.meta.env.PROD) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.NODE_ENV,
      tracesSampleRate: 0.2,
      beforeSend(event) {
        // Filter out development errors
        if (event.exception?.values?.[0]?.value?.includes('development')) {
          return null;
        }
        return event;
      },
    });
  }
}
```

### Health Check Endpoint
```typescript
// health.ts
export function setupHealthCheck() {
  // Expose health check endpoint
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
  
  // Report application health
  setInterval(() => {
    fetch('/api/health', {
      method: 'POST',
      body: JSON.stringify({
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        performance: performance.now(),
      }),
    });
  }, 60000); // Every minute
}
```

---

*This deployment and scaling documentation provides comprehensive guidance for production deployment, monitoring, and scaling of the Cepro.ai frontend application. Follow these practices to ensure reliable, secure, and performant deployment.*
