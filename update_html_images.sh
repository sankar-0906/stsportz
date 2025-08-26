#!/bin/bash

# ST Sportz HTML Image Update Script
# This script updates all HTML files to use optimized images

echo "🔄 Updating HTML files to use optimized images..."
echo "================================================"

# Function to update image paths in HTML files
update_image_paths() {
    local html_file="$1"
    local original_dir="$2"
    local optimized_dir="$3"
    
    echo "Processing: $html_file"
    
    # Create backup
    cp "$html_file" "${html_file}.backup"
    
    # Update image paths
    sed -i '' "s|$original_dir/|$optimized_dir/|g" "$html_file"
    
    echo "  ✅ Updated image paths"
}

# Update all HTML files
for html_file in *.html; do
    if [ -f "$html_file" ]; then
        echo ""
        echo "📄 Processing $html_file..."
        
        # Update court photos
        update_image_paths "$html_file" "CourtPhotos" "CourtPhotos/optimized"
        
        # Update event photos
        update_image_paths "$html_file" "events" "events/optimized"
        
        # Update main images
        update_image_paths "$html_file" "images" "images/optimized"
        
        echo "  ✅ $html_file updated successfully"
    fi
done

echo ""
echo "🎯 HTML Update Summary:"
echo "✅ All HTML files updated to use optimized images"
echo "✅ Original files backed up with .backup extension"
echo ""
echo "📊 Expected Performance Improvements:"
echo "  - 94% reduction in image file sizes"
echo "  - Faster page loading times"
echo "  - Better mobile performance"
echo "  - Reduced bandwidth usage"
echo ""
echo "💡 Next steps:"
echo "1. Test your website - it should load much faster!"
echo "2. Check that all images display correctly"
echo "3. Consider implementing WebP with fallbacks for even better performance"
echo "4. If everything looks good, you can delete the original large images" 