FROM php:8.2-apache

# Enable required PHP extensions and Apache modules
RUN docker-php-ext-install mysqli \
    && a2enmod rewrite

# Update Apache to listen on port 5000
RUN sed -i 's/80/5000/g' /etc/apache2/ports.conf \
    && sed -i 's/:80/:5000/g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# Copy application code
COPY api/ /var/www/html/
COPY includes/ /var/www/html/includes/

EXPOSE 5000

CMD ["apache2-foreground"]
