// Script de prueba para el endpoint del dashboard
const API_BASE = "http://localhost:3001";

async function testDashboardEndpoint() {
  try {
    console.log("🧪 Probando endpoint del dashboard...");
    
    const response = await fetch(`${API_BASE}/api/actividades/dashboard-stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(`📊 Código de respuesta: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Dashboard endpoint funcionando correctamente:");
      console.log("📋 Estructura de datos:");
      console.log("- Estadísticas generales:", data.data.estadisticas_generales ? "✅" : "❌");
      console.log("- Ocupación por actividad:", data.data.ocupacion_por_actividad ? "✅" : "❌");
      console.log("- Estadísticas por tipo:", data.data.estadisticas_por_tipo ? "✅" : "❌");
      console.log("- Actividades mayor ocupación:", data.data.actividades_mayor_ocupacion ? "✅" : "❌");
      console.log("- Actividades menor ocupación:", data.data.actividades_menor_ocupacion ? "✅" : "❌");
      console.log("- Última actualización:", data.data.ultima_actualizacion ? "✅" : "❌");
      
      // Mostrar algunos datos de ejemplo
      if (data.data.estadisticas_generales) {
        console.log("\n📈 Estadísticas generales:");
        console.log("- Total actividades:", data.data.estadisticas_generales.total_actividades);
        console.log("- Workshops:", data.data.estadisticas_generales.workshops);
        console.log("- Cupo total:", data.data.estadisticas_generales.cupo_total);
      }
      
      if (data.data.ocupacion_por_actividad && data.data.ocupacion_por_actividad.length > 0) {
        console.log("\n🎯 Primera actividad:");
        const primera = data.data.ocupacion_por_actividad[0];
        console.log("- Nombre:", primera.nombre);
        console.log("- Tipo:", primera.tipo);
        console.log("- Ocupación:", `${primera.ocupacion_actual}/${primera.cupo_maximo} (${primera.porcentaje_ocupacion}%)`);
      }
      
    } else {
      const errorText = await response.text();
      console.log(`❌ Error del servidor (${response.status}):`);
      console.log("📋 Respuesta:", errorText);
    }

  } catch (error) {
    console.error("❌ Error de red:", error);
  }
}

// Ejecutar la prueba
testDashboardEndpoint();