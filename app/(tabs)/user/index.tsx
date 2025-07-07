import React, { useState } from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import Label from "@/components/ui/Label";
import { User, Mail, CircleHelp, DollarSign, CreditCard, Eye, EyeOff } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SmallText } from "@/components/ui/SmallText";

export default function Index() {
  const { getAccountInfo, mail, nickname, nombre, esAlumno, getSaldo, getNumeroTarjeta, isAlumno, getAlumnoId } = useUserStore();
  
  // Estados para datos adicionales de alumno
  const [saldoCuenta, setSaldoCuenta] = useState<number | null>(null);
  const [numeroTarjeta, setNumeroTarjeta] = useState<string | null>(null);
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false);
  const [loadingDatosAlumno, setLoadingDatosAlumno] = useState(false);
 
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const info = await getAccountInfo();
        console.log("Información de la cuenta:", info);
        
        // Si es alumno, cargar datos adicionales
        if (esAlumno) {
          console.log("👤 Usuario es alumno, cargando datos adicionales...");
          setLoadingDatosAlumno(true);
          try {
            console.log("💰 Obteniendo saldo...");
            const saldo = await getSaldo();
            console.log("💰 Saldo obtenido:", saldo);
            setSaldoCuenta(saldo);
            
            console.log("💳 Obteniendo número de tarjeta...");
            const tarjeta = await getNumeroTarjeta();
            console.log("💳 Tarjeta obtenida:", tarjeta ? `****${tarjeta.slice(-4)}` : null);
            setNumeroTarjeta(tarjeta);
            
            console.log("✅ Datos de alumno cargados exitosamente");
          } catch (error) {
            console.error("❌ Error al cargar datos del alumno:", error);
          } finally {
            setLoadingDatosAlumno(false);
          }
        } else {
          console.log("👤 Usuario NO es alumno, omitiendo datos adicionales");
        }
      } catch (error) {
        console.error("Error al obtener la información de la cuenta:", error);
      }
    };
    
    cargarDatos();
  }, [esAlumno]);

  const censurarTarjeta = (numero: string) => {
    if (!numero) return "****";
    return `****${numero.slice(-4)}`;
  };

  const toggleMostrarTarjeta = () => {
    setMostrarTarjeta(!mostrarTarjeta);
  };


  //claude
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <Column
      style={{ flex: 1, gap: 32, justifyContent: "flex-start", marginTop: 32 }}
    >
      <Title>Mi Perfil</Title>
      
      {/* Campos básicos para todos los usuarios */}
      <Label text={nombre || nickname || ""} Icon={User} />
      <Label text={mail ?? ""} Icon={Mail} />
      <Label text={esAlumno ? "Alumno" : "Usuario"} Icon={CircleHelp} />
      
      {/* Campos adicionales solo para alumnos */}
      {esAlumno && (
        <>
          {/* Saldo de cuenta corriente */}
          <Label 
            text={saldoCuenta !== null ? `$${saldoCuenta.toFixed(2)}` : (loadingDatosAlumno ? "Cargando..." : "No disponible")} 
            Icon={DollarSign}
          />
          
          {/* Número de tarjeta con opción de mostrar/ocultar */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldInfo}>
              <CreditCard size={20} color="#666" />
              <SmallText style={styles.fieldValue}>
                {numeroTarjeta 
                  ? (mostrarTarjeta ? numeroTarjeta : censurarTarjeta(numeroTarjeta))
                  : (loadingDatosAlumno ? "Cargando..." : "No disponible")
                }
              </SmallText>
            </View>
            {numeroTarjeta && (
              <TouchableOpacity onPress={toggleMostrarTarjeta} style={styles.eyeButton}>
                {mostrarTarjeta ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      
      {/* Solo mostrar el botón si no es alumno */}
      {!esAlumno && (
        <Button
          onPress={() => {
            router.push("/register/alumno");
          }}
        >
          Convertirse en alumno
        </Button>
      )}

      <Button onPress={() => router.push("/logout")}>Cerrar sesión</Button>
    </Column>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginHorizontal: 0,
  },
  fieldInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    minWidth: 60,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    flex: 1,
  },
  eyeButton: {
    padding: 8,
    borderRadius: 4,
  },
});
