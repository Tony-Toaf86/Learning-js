CREATE DATABASE cooperativa;
USE cooperativa;

CREATE TABLE socios (
    id_socio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aportaciones (
    id_aportacion INT AUTO_INCREMENT PRIMARY KEY,
    id_socio INT,
    monto DECIMAL(12, 2) NOT NULL,
    tipo_aportacion ENUM('mensual', 'extraordinaria') NOT NULL,
    fecha_aportacion DATE NOT NULL,
    FOREIGN KEY (id_socio) REFERENCES socios(id_socio) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);