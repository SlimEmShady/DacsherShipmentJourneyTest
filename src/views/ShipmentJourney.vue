<script setup lang="ts">
import {computed, ref} from "vue";
import moment from "moment";
import type {StopPoint} from "@/types/StopPoint.ts";
import {
  formatDuration,
  formatTime,
  getDurationBetween,
  getTravelMinutes
} from "@/helpers/formatTime.ts";

// Base data (speed is in km/h and distance is in km)
const truckSpeed = 120;
const baseStopPoints: StopPoint[] = [
  {
    name: "Point A",
    distanceFromPreviousPoint: 0,
    totalDistance: 0,
    departureTime: moment().hour(8).minute(0).second(0).toDate(), // today 08:00AM
  },
  {
    name: "Point B",
    distanceFromPreviousPoint: 300,
    stopDuration: 120,
  },
  {
    name: "Point C",
    distanceFromPreviousPoint: 200,
  },
];

// State
const currentPointIndex = ref(0);

// Methods
const goToNextPoint = () => {
  currentPointIndex.value++;
}
const goToPreviousPoint = () => {
  currentPointIndex.value--;
}

// Return the travel time to the next point
const travelTimeToNext = (index: number): string => {
  if (index >= computedStopPoints.value.length - 1) return "";
  const nextPoint = computedStopPoints.value[index + 1];

  if (!nextPoint) return "";

  const minutes = getTravelMinutes(nextPoint.distanceFromPreviousPoint, truckSpeed);

  return formatDuration(minutes);
};

// Computed
const computedStopPoints = computed<StopPoint[]>(() => {
  const result: StopPoint[] = [];

  baseStopPoints.forEach((point, index) => {
    // Keep the first point as is
    if (index === 0) {
      result.push(point);
      return;
    }

    // Get the previous point
    const prev = result[index - 1];

    if(prev) {
      if (!prev.departureTime) {
        throw new Error(`Missing departure at ${prev.name}`);
      }

      // Calculate arrival and departure times
      const prevDeparture = moment(prev.departureTime);
      const travelMinutes = getTravelMinutes(point.distanceFromPreviousPoint, truckSpeed);

      const arrival = prevDeparture.clone().add(travelMinutes, "minutes");
      const departure = point.stopDuration
        ? arrival.clone().add(point.stopDuration, "minutes")
        : arrival;

      // Calculate the total distance
      const totalDistance = prev.totalDistance ?
        prev.totalDistance + point.distanceFromPreviousPoint :
        point.distanceFromPreviousPoint;

      result.push({
        ...point,
        arrivalTime: arrival.toDate(),
        departureTime: departure.toDate(),
        totalDistance
      });
    }
  });

  return result;
});

const journeyStart = computed(() => computedStopPoints.value[0]?.departureTime ?? null);

const journeyEnd = computed(() => {
  const last = computedStopPoints.value[computedStopPoints.value.length - 1];

  return last?.arrivalTime;
});

const journeyDuration = computed(() => {
  if (!journeyStart.value || !journeyEnd.value) return "";

  return formatDuration(getDurationBetween(journeyStart.value, journeyEnd.value));
});

const journeyProgress = computed(() => {
  if (!journeyStart.value || !journeyEnd.value) return 0;

  const totalMinutes = getDurationBetween(journeyStart.value, journeyEnd.value);

  const currentPoint = computedStopPoints.value[currentPointIndex.value];
  if (!currentPoint) return 0;

  const elapsedMinutes = moment(currentPoint.departureTime || currentPoint.arrivalTime)
    .diff(journeyStart.value, "minutes");

  return Math.min(100, (elapsedMinutes / totalMinutes) * 100);
});

const currentDeliveryDuration = computed(() => {
  const currentPoint = computedStopPoints.value[currentPointIndex.value];
  if (!currentPoint || !journeyStart.value) return "";

  return formatDuration(
    moment(currentPoint.departureTime || currentPoint.arrivalTime)
      .diff(moment(journeyStart.value), 'minutes')
  );
});
</script>

<template>
  <h1 class="v-heading mb-15 text-h3 text-sm-h3">Shipment journey</h1>

  <v-timeline direction="horizontal" line-inset="12" side="end">
    <template v-for="(point, index) in computedStopPoints" :key="index">
      <v-timeline-item
        :dot-color="index <= currentPointIndex ? 'primary' : ''"
      >
        <!-- Distance at top -->
        <template v-slot:opposite>
          <strong>{{ point.totalDistance }}km</strong>
        </template>

        <!-- Times at bottom -->
        <div class="text-center">
          <span v-if="point.arrivalTime && point.departureTime && point.arrivalTime.getTime() !== point.departureTime.getTime()">
            Arrival time: <strong>{{ formatTime(point.arrivalTime) }}</strong> → Departure time: <strong>{{ formatTime(point.departureTime) }}</strong><br />

            <template v-if="point.stopDuration">Stop duration: <strong>{{ formatDuration(point.stopDuration || 0) }}</strong></template>
          </span>
            <span v-else-if="point.arrivalTime">
              Arrival time: <strong>{{ formatTime(point.arrivalTime) }}</strong>
          </span>
            <span v-else>
              Departure time: <strong>{{ formatTime(point.departureTime) }}</strong>
          </span>
        </div>

        <!-- Truck icon -->
        <template v-slot:icon v-if="index <= currentPointIndex">
          <v-icon color="secondary">mdi-truck</v-icon>
        </template>
      </v-timeline-item>

      <!-- Journey duration between points -->
      <v-timeline-item
        v-if="index < computedStopPoints.length - 1"
        class="travel-time"
        hide-dot
      >
        Travel duration: <strong>{{ travelTimeToNext(index) }}</strong>
      </v-timeline-item>
    </template>
  </v-timeline>

  <div class="mt-10">Duration of the journey: {{ journeyDuration }}</div>
  <div class="mt-2">*All times and durations displayed are estimated.</div>

  <div class="d-flex align-center justify-center mt-10">
    <!-- Previous button or blank space -->
    <div class="btn-container">
      <v-btn
        v-if="currentPointIndex > 0"
        @click="goToPreviousPoint"
        color="primary"
      >
        Go to previous point
      </v-btn>
    </div>

    <!-- Progress bar -->
    <v-progress-linear
      :model-value="journeyProgress"
      height="20"
      color="secondary"
      bg-color="primary"
      rounded
      style="width: 250px; margin: 0 16px;"
    >
      <template v-slot:default>
        Current delivery duration: {{ currentDeliveryDuration }}
      </template>
    </v-progress-linear>

    <!-- Next button or blank space -->
    <div class="btn-container">
      <v-btn
        v-if="currentPointIndex < computedStopPoints.length - 1"
        @click="goToNextPoint"
        color="primary"
      >
        Go to next point
      </v-btn>
    </div>
  </div>

</template>

<style scoped>
  .btn-container {
    width: 200px;
    text-align: center;
  }
</style>
