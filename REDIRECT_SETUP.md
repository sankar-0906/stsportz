# 🔄 Redirect Setup Guide: www.stsportz.com → stsportz.com

## 📋 Overview
This guide explains how to set up redirects to ensure all traffic goes to the main domain `https://stsportz.com` without the `www` prefix.

## 🎯 Redirect Goals
- `https://www.stsportz.com` → `https://stsportz.com`
- `http://www.stsportz.com` → `https://stsportz.com`
- `http://stsportz.com` → `https://stsportz.com`

## 🛠️ Method 1: Nginx Configuration (Recommended)

### Step 1: Access Your Server
```bash
ssh root@your-droplet-ip
```

### Step 2: Edit Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/stsportz.com
```

### Step 3: Add Redirect Configuration
Replace or update your Nginx configuration with:

```nginx
# Redirect www to non-www
server {
    listen 80;
    listen 443 ssl http2;
    server_name www.stsportz.com;
    
    # SSL Configuration (if you have SSL for www)
    ssl_certificate /etc/letsencrypt/live/www.stsportz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.stsportz.com/privkey.pem;
    
    # Redirect all traffic to non-www
    return 301 https://stsportz.com$request_uri;
}

# Main server block
server {
    listen 80;
    listen 443 ssl http2;
    server_name stsportz.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/stsportz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stsportz.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Document root
    root /var/www/STsportz;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Main location block
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### Step 4: Test Configuration
```bash
sudo nginx -t
```

### Step 5: Reload Nginx
```bash
sudo systemctl reload nginx
```

## 🛠️ Method 2: Using .htaccess (If using Apache)

If you're using Apache instead of Nginx, create a `.htaccess` file in your root directory:

```apache
# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.stsportz\.com [NC]
RewriteRule ^(.*)$ https://stsportz.com/$1 [L,R=301]

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🛠️ Method 3: DNS-Level Redirect (Alternative)

### Using Cloudflare (Recommended)
1. **Login to Cloudflare**
2. **Select your domain** (stsportz.com)
3. **Go to Page Rules**
4. **Create a new rule**:
   - URL: `www.stsportz.com/*`
   - Setting: `Forwarding URL`
   - Status: `301 - Permanent Redirect`
   - Destination: `https://stsportz.com/$1`

### Using cPanel Redirects
1. **Login to cPanel**
2. **Find "Redirects"** in the Domains section
3. **Create redirect**:
   - Type: `Permanent (301)`
   - From: `www.stsportz.com`
   - To: `https://stsportz.com`

## 🔍 Testing Your Redirects

### Test Commands
```bash
# Test www to non-www redirect
curl -I http://www.stsportz.com
curl -I https://www.stsportz.com

# Test HTTP to HTTPS redirect
curl -I http://stsportz.com

# Expected response headers:
# HTTP/1.1 301 Moved Permanently
# Location: https://stsportz.com/
```

### Online Tools
- **Redirect Checker**: https://redirect-checker.org/
- **HTTP Status Checker**: https://httpstatus.io/
- **SEO Tools**: https://www.seoreviewtools.com/redirect-checker/

## 📊 SEO Benefits

### Why Redirect www to non-www?
1. **Consistent URLs**: All links point to the same domain
2. **Better SEO**: Search engines prefer one canonical version
3. **Analytics Accuracy**: All traffic consolidated in one domain
4. **User Experience**: Consistent branding and URLs

### Best Practices
- ✅ Use **301 (Permanent)** redirects
- ✅ Redirect to **HTTPS** version
- ✅ Include **query parameters** and **path**
- ✅ Test redirects thoroughly
- ✅ Monitor for any broken links

## 🔧 SSL Certificate Setup

### For www subdomain
```bash
# Install SSL for www subdomain
sudo certbot --nginx -d www.stsportz.com

# Or manually
sudo certbot certonly --nginx -d www.stsportz.com
```

### Verify SSL
```bash
# Check SSL certificate
openssl s_client -connect www.stsportz.com:443 -servername www.stsportz.com

# Test with curl
curl -I https://www.stsportz.com
```

## 🚨 Troubleshooting

### Common Issues
1. **Redirect Loop**: Check for conflicting rules
2. **SSL Errors**: Ensure certificates are valid
3. **Cache Issues**: Clear browser and server cache
4. **DNS Propagation**: Wait 24-48 hours for DNS changes

### Debug Commands
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx configuration
sudo nginx -t

# Check SSL certificate
sudo certbot certificates
```

## 📈 Monitoring

### Set Up Monitoring
1. **Google Search Console**: Add both www and non-www versions
2. **Analytics**: Ensure tracking works on both domains
3. **Uptime Monitoring**: Monitor both domains for availability
4. **SSL Monitoring**: Check certificate expiration

### Regular Checks
- ✅ Redirects working correctly
- ✅ SSL certificates valid
- ✅ No 404 errors on old URLs
- ✅ Analytics tracking properly
- ✅ Search console reports clean

## 🎯 Final Checklist

- [ ] Nginx configuration updated
- [ ] SSL certificates installed for both domains
- [ ] Redirects tested and working
- [ ] Google Search Console updated
- [ ] Analytics tracking verified
- [ ] Old bookmarks and links updated
- [ ] Monitoring set up
- [ ] Documentation updated

## 💡 Pro Tips

1. **Keep www SSL certificate** even after redirect for security
2. **Monitor redirect chains** to ensure they're not too long
3. **Update internal links** to use non-www version
4. **Inform team members** about the change
5. **Keep redirects active** for at least 1 year

---

**Your redirects are now properly configured for optimal SEO and user experience! 🚀** 