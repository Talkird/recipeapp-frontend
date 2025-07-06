import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { SmallText } from "./ui/SmallText";

interface CamaraUploadProps {
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
}

const CamaraUpload: React.FC<CamaraUploadProps> = ({ 
  onImagesChange, 
  maxImages = 2 
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Se necesitan permisos para acceder a la galería de fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const remainingSlots = maxImages - selectedImages.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        'Límite alcanzado',
        `Ya has seleccionado el máximo de ${maxImages} imágenes.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: remainingSlots > 1,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        const imagesToAdd = newImages.slice(0, remainingSlots);
        const updatedImages = [...selectedImages, ...imagesToAdd];
        
        setSelectedImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error);
      Alert.alert('Error', 'No se pudieron cargar las imágenes');
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {selectedImages.map((imageUri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
        
        {selectedImages.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={pickImages}>
            <Plus size={42} color="#343434" />
            <SmallText style={styles.addText}>
              {selectedImages.length === 0 ? 'Agregar imágenes' : 'Agregar más'}
            </SmallText>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      <View style={styles.infoContainer}>
        <SmallText style={styles.infoText}>
          <ImageIcon size={12} color="#666666" />
          {` ${selectedImages.length}/${maxImages} imágenes seleccionadas`}
        </SmallText>
        <SmallText style={styles.formatText}>
          Formatos: JPG, PNG, WEBP
        </SmallText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  scrollContainer: {
    gap: 12,
    paddingHorizontal: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: 170,
    height: 115,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 170,
    height: 115,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addText: {
    color: '#343434',
    fontSize: 12,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
  },
  formatText: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
  },
});

export default CamaraUpload;
