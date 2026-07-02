import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { GetAttendaceThunks } from '../feature/attendance/redux/thunks';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react-native';

export default function AttendanceScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch<AppDispatch>();
  const attendanceData = useSelector((state: RootState) => state.attendace.data) as any;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    dispatch(GetAttendaceThunks(currentDate.toDateString()));
  }, [currentDate, dispatch]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week = [];

    // Align start: 0 means Sunday, 1 means Monday...
    // In original code, startDay is Mon=0, Tue=1, ..., Sun=6
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
      week.push(0);
    }

    for (let day = 1; day <= totalDays; day++) {
      week.push(day);

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    while (week.length < 7) {
      week.push(0);
    }

    calendar.push(week);
    return calendar;
  };

  const calendarRows = generateCalendar(currentDate);

  const getDayStatus = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData?.[key] || null;
  };

  const isWeekend = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = d.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getStatusColor = (status: string) => {
    if (status === 'PRESENT') return '#10b981'; // emerald 500
    if (status === 'ABSENT') return '#ef4444'; // rose 500
    if (status === 'LATE') return '#f59e0b'; // amber 500
    return '#94a3b8'; // slate 400
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendance Tracker</Text>
          <Text style={styles.subtitle}>Monitor your monthly attendance status and check-ins.</Text>
        </View>

        <View style={styles.calendarCard}>
          {/* Calendar Navigation */}
          <View style={styles.navRow}>
            <View style={styles.monthDisplay}>
              <View style={styles.calendarIconContainer}>
                <CalendarIcon size={18} color="#2563eb" />
              </View>
              <Text style={styles.monthText}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
            </View>

            <View style={styles.arrowsContainer}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
                <ChevronLeft size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
                <ChevronRight size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
              <Text style={[styles.legendText, { color: '#059669' }]}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
              <Text style={[styles.legendText, { color: '#dc2626' }]}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
              <Text style={[styles.legendText, { color: '#d97706' }]}>Late</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#cbd5e1' }]} />
              <Text style={[styles.legendText, { color: '#64748b' }]}>No Class</Text>
            </View>
          </View>

          {/* Weekday Names Header */}
          <View style={styles.gridHeader}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.gridHeaderCell}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.gridBody}>
            {calendarRows.map((row, i) => (
              <View key={i} style={styles.gridRow}>
                {row.map((day, j) => {
                  if (day === 0) {
                    return <View key={`${i}-${j}`} style={styles.gridCellEmpty} />;
                  }

                  const statusData = getDayStatus(day);
                  const weekend = isWeekend(day);
                  const isToday =
                    new Date().toDateString() ===
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                  return (
                    <View
                      key={day}
                      style={[
                        styles.gridCell,
                        weekend && styles.gridCellWeekend,
                        isToday && styles.gridCellToday,
                        statusData?.status === 'PRESENT' && styles.cellPresent,
                        statusData?.status === 'ABSENT' && styles.cellAbsent,
                        statusData?.status === 'LATE' && styles.cellLate
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isToday && styles.dayTextToday,
                          weekend && styles.dayTextWeekend
                        ]}
                      >
                        {day}
                      </Text>

                      {statusData ? (
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(statusData.status) }]} />
                      ) : (
                        <View style={[styles.statusDot, { backgroundColor: 'transparent' }]} />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
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
  calendarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    paddingBottom: 12,
    marginBottom: 12,
  },
  monthDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  arrowsContainer: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  arrowButton: {
    padding: 6,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
  },
  gridHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  gridHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridBody: {
    gap: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 6,
  },
  gridCell: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridCellEmpty: {
    flex: 1,
    height: 52,
    backgroundColor: 'transparent',
  },
  gridCellWeekend: {
    backgroundColor: '#f8fafc',
  },
  gridCellToday: {
    borderColor: '#3b82f6',
    borderWidth: 1.5,
  },
  cellPresent: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  cellAbsent: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  cellLate: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  dayTextToday: {
    color: '#2563eb',
    fontWeight: '800',
  },
  dayTextWeekend: {
    color: '#64748b',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
