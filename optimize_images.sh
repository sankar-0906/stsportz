#!/bin/bash

# ST Sportz Image Optimization Script
# This script optimizes all images for web use while maintaining quality

echo "🚀 Starting ST Sportz Image Optimization..."
echo "=========================================="

# Create optimized directories
mkdir -p images/optimized
mkdir -p CourtPhotos/optimized
mkdir -p events/optimized

# Function to optimize images
optimize_image() {
    local input_file="$1"
    local output_file="$2"
    local max_width="$3"
    local quality="$4"
    
    echo "Processing: $(basename "$input_file")"
    
    # Get original file size
    original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
    
    # Optimize image
    convert "$input_file" \
        -resize "${max_width}x${max_width}>" \
        -quality "$quality" \
        -strip \
        -interlace Plane \
        "$output_file"
    
    # Get optimized file size
    optimized_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
    
    # Calculate savings
    savings=$((original_size - optimized_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "  Original: $(numfmt --to=iec-i --suffix=B $original_size)"
    echo "  Optimized: $(numfmt --to=iec-i --suffix=B $optimized_size)"
    echo "  Savings: $(numfmt --to=iec-i --suffix=B $savings) ($savings_percent%)"
    echo ""
}

# Optimize main images (logos, icons)
echo "📸 Optimizing main images..."
for img in images/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        extension="${filename##*.}"
        name="${filename%.*}"
        
        case "$extension" in
            jpg|jpeg)
                optimize_image "$img" "images/optimized/${name}.jpg" 800 85
                ;;
            png)
                optimize_image "$img" "images/optimized/${name}.png" 800 85
                ;;
        esac
    fi
done

# Optimize PNG subdirectories
echo "🎨 Optimizing PNG assets..."
for img in images/PNG/**/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        # Create subdirectory structure
        dir=$(dirname "$img" | sed 's|images/|images/optimized/|')
        mkdir -p "$dir"
        
        optimize_image "$img" "${dir}/${name}.png" 400 90
    fi
done

# Optimize court photos (high quality, larger size for detail)
echo "🏸 Optimizing court photos..."
for img in CourtPhotos/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        optimize_image "$img" "CourtPhotos/optimized/${name}.jpg" 1200 80
    fi
done

# Optimize event photos (medium quality for web)
echo "🎉 Optimizing event photos..."
for img in events/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        optimize_image "$img" "events/optimized/${name}.jpg" 1000 75
    fi
done

# Create WebP versions for modern browsers (additional 30-50% savings)
echo "🌐 Creating WebP versions..."
for img in images/optimized/*.{jpg,png}; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        convert "$img" -quality 80 "images/optimized/${name}.webp"
        echo "  Created: ${name}.webp"
    fi
done

for img in CourtPhotos/optimized/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        convert "$img" -quality 75 "CourtPhotos/optimized/${name}.webp"
        echo "  Created: ${name}.webp"
    fi
done

for img in events/optimized/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        name="${filename%.*}"
        
        convert "$img" -quality 70 "events/optimized/${name}.webp"
        echo "  Created: ${name}.webp"
    fi
done

# Generate optimization report
echo "📊 Generating optimization report..."
echo "=========================================="

total_original=0
total_optimized=0

# Calculate total savings
for img in images/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_original=$((total_original + original_size))
    fi
done

for img in CourtPhotos/*.jpg; do
    if [ -f "$img" ]; then
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_original=$((total_original + original_size))
    fi
done

for img in events/*.jpg; do
    if [ -f "$img" ]; then
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_original=$((total_original + original_size))
    fi
done

# Calculate optimized sizes
for img in images/optimized/*.{jpg,png}; do
    if [ -f "$img" ]; then
        optimized_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_optimized=$((total_optimized + optimized_size))
    fi
done

for img in CourtPhotos/optimized/*.jpg; do
    if [ -f "$img" ]; then
        optimized_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_optimized=$((total_optimized + optimized_size))
    fi
done

for img in events/optimized/*.jpg; do
    if [ -f "$img" ]; then
        optimized_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_optimized=$((total_optimized + optimized_size))
    fi
done

total_savings=$((total_original - total_optimized))
total_savings_percent=$((total_savings * 100 / total_original))

echo "🎯 OPTIMIZATION SUMMARY:"
echo "Original total size: $(numfmt --to=iec-i --suffix=B $total_original)"
echo "Optimized total size: $(numfmt --to=iec-i --suffix=B $total_optimized)"
echo "Total savings: $(numfmt --to=iec-i --suffix=B $total_savings) ($total_savings_percent%)"
echo ""
echo "✅ Optimization complete! Optimized images are in:"
echo "  - images/optimized/"
echo "  - CourtPhotos/optimized/"
echo "  - events/optimized/"
echo ""
echo "💡 Next steps:"
echo "1. Update your HTML files to use the optimized images"
echo "2. Consider implementing WebP with fallbacks for even better performance"
echo "3. Test the site loading speed - it should be significantly faster!" 