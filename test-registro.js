// Script de prueba para validar la ventana de inscripción
const API_BASE = "http://localhost:3001";

async function testRegistroVentana() {
  try {
    console.log("🧪 Probando validación de ventana de inscripción...");
    
    const testData = {
      apellidoPaterno: "Prueba",
      apellidoMaterno: "Ventana",
      primerNombre: "Test",
      email: `test-ventana-${Date.now()}@ejemplo.com`,
      telefono: "9999999999",
      categoria: "Estudiante de Ingeniería Industrial",
      programa: "Ingeniería Industrial"
    };

    const response = await fetch(`${API_BASE}/api/participantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    console.log(`📊 Código de respuesta: ${response.status}`);

    if (response.status === 422) {
      const errorData = await response.json();
      console.log("✅ Error 422 detectado correctamente:");
      console.log("📋 Datos del error:", errorData);
      
      if (errorData.error && errorData.error.includes("período de inscripción")) {
        console.log("✅ Mensaje de ventana de inscripción funcionando correctamente");
      } else {
        console.log("❌ Mensaje de error no coincide con ventana de inscripción");
      }
    } else if (response.ok) {
      const data = await response.json();
      console.log("⚠️  Registro exitoso - puede que la ventana esté abierta:");
      console.log("📋 Datos:", data);
    } else {
      const errorText = await response.text();
      console.log(`❌ Error inesperado (${response.status}):`);
      console.log("📋 Respuesta:", errorText);
    }

  } catch (error) {
    console.error("❌ Error de red:", error);
  }
}

// Ejecutar la prueba
testRegistroVentana();