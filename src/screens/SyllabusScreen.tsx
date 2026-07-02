import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectNote } from '../feature/notes/reducer/slector';
import { getNoteByIdThunk } from '../feature/notes/reducer/thunk';
import { Calendar, Download, Book } from 'lucide-react-native';

export default function SyllabusScreen() {
  const dispatch = useDispatch<any>();
  const notesdata = useSelector(selectNote) as any[];

  useEffect(() => {
    dispatch(getNoteByIdThunk());
  }, [dispatch]);

  const handleDownload = (materialName: string) => {
    Alert.alert('Download Started', `Downloading: ${materialName}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Syllabus & Materials</Text>
          <Text style={styles.subtitle}>Access your topics, syllabi, and downloadable resources.</Text>
        </View>

        {notesdata && notesdata.length > 0 ? (
          notesdata.map((item: any, index: number) => (
            <View key={item?.topicName || index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicName}>{item?.topicName}</Text>
                  <Text style={styles.classType}>{item?.classType}</Text>
                </View>
                <View>
                  {item?.status === 'completed' && (
                    <View style={[styles.statusBadge, styles.completedBadge]}>
                      <Text style={[styles.statusBadgeText, styles.completedBadgeText]}>Completed</Text>
                    </View>
                  )}
                  {item?.status === 'ongoing' && (
                    <View style={[styles.statusBadge, styles.ongoingBadge]}>
                      <Text style={[styles.statusBadgeText, styles.ongoingBadgeText]}>Ongoing</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.metaRow}>
                <Calendar size={14} color="#64748b" style={{ marginRight: 6 }} />
                <Text style={styles.metaText}>Date: {item?.classDate}</Text>
              </View>

              <View style={styles.downloadContainer}>
                <View style={styles.downloadHeader}>
                  <Book size={14} color="#334155" style={{ marginRight: 6 }} />
                  <Text style={styles.downloadHeaderTitle}>Study Handouts</Text>
                </View>
                <View style={styles.downloadRow}>
                  <Text style={styles.materialName} numberOfLines={1}>
                    {item?.materialType || 'Topic Handout.pdf'}
                  </Text>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => handleDownload(item?.materialType || 'Topic Handout.pdf')}
                  >
                    <Download size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No materials available yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  classType: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  completedBadge: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  ongoingBadge: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  completedBadgeText: {
    color: '#059669',
  },
  ongoingBadgeText: {
    color: '#2563eb',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  downloadContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  downloadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
  },
  downloadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  materialName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
    marginRight: 12,
  },
  downloadButton: {
    padding: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
