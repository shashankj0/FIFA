"use strict";

/**
 * ArenaMind 2026 - Stadium Operations Simulation Engine
 * Manages the mock real-time state of MetLife Stadium for the live demo.
 */

/**
 * Wait time in minutes for Gate C when congested.
 * @const {number}
 */
const GATE_C_CONGESTED_WAIT = 22;

/**
 * Wait time in minutes for Gate C when resolved.
 * @const {number}
 */
const GATE_C_RESOLVED_WAIT = 5;

class StadiumSimulator {
  /**
   * Initializes the simulator state and starts the real-time simulation interval.
   */
  constructor() {
    this.resetState();
    this.startSimulationLoop();
  }

  /**
   * Resets the simulator metrics and incidents logs back to default nominal states.
   * @returns {void}
   */
  resetState() {
    this.state = {
      occupancy: 74289,
      capacity: 82500,
      gates: {
        'Gate A (North)': { waitTime: 4, status: 'Clear', load: 'Low' },
        'Gate B (East)': { waitTime: 5, status: 'Clear', load: 'Low' },
        'Gate C (South)': { waitTime: 3, status: 'Clear', load: 'Low' },
        'Gate D (West)': { waitTime: 18, status: 'Congested', load: 'High' }
      },
      transit: {
        'Express Rail': { delay: 0, status: 'On Time', frequency: '5 min' },
        'Tournament Shuttle': { delay: 4, status: 'Minor Delay', frequency: '8 min' },
        'Carpool Lot': { delay: 12, status: 'Busy', occupancy: '88%' }
      },
      incidents: [
        {
          id: 'inc-gate-d',
          target: 'Gate D (West)',
          level: 'critical',
          title: 'Gate D Bottleneck',
          description: 'Queue wait time exceeds 18 minutes. Large crowd cluster forming outside security lanes.',
          timestamp: new Date().toLocaleTimeString(),
          aiResolved: false
        }
      ],
      sustainability: {
        recyclingRate: 64, // percentage
        greenEnergyUsage: 82, // percentage
        publicTransitShare: 68 // percentage
      }
    };
    this.broadcastUpdate();
  }

  /**
   * Starts a simulation loop interval to periodically fluctuate gate wait times and spectator count.
   * @returns {void}
   */
  startSimulationLoop() {
    // Periodically fluctuate values to simulate real live data feeds
    this.intervalId = setInterval(() => {
      // Fluctuate Occupancy (+- 20 people, max capacity check)
      const change = Math.floor(Math.random() * 41) - 20;
      this.state.occupancy = Math.min(this.state.capacity, Math.max(0, this.state.occupancy + change));

      // Fluctuate gate wait times slightly
      for (const gate in this.state.gates) {
        if (gate === 'Gate D (West)' && !this.state.gates[gate].resolved) {
          // Gate D stays congested until resolved by AI
          this.state.gates[gate].waitTime = Math.min(30, Math.max(15, this.state.gates[gate].waitTime + (Math.random() > 0.5 ? 1 : -1)));
        } else {
          const delta = Math.random() > 0.5 ? 1 : -1;
          this.state.gates[gate].waitTime = Math.min(15, Math.max(2, this.state.gates[gate].waitTime + delta));
          this.state.gates[gate].status = this.state.gates[gate].waitTime > 10 ? 'Busy' : 'Clear';
          this.state.gates[gate].load = this.state.gates[gate].waitTime > 10 ? 'Medium' : 'Low';
        }
      }

      this.broadcastUpdate();
    }, 6000);
  }

  /**
   * Halts the simulation interval loop.
   * @returns {void}
   */
  stopSimulationLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Triggers a new incident and logs wait latency offsets onto target gates.
   * @param {string} type The category trigger selector ('gate-c', 'medical', 'concession').
   * @returns {object|null} The newly triggered incident details object, or null if duplicate.
   */
  triggerIncident(type) {
    const id = `inc-${Date.now()}`;
    let newIncident;

    if (type === 'gate-c') {
      this.state.gates['Gate C (South)'].waitTime = GATE_C_CONGESTED_WAIT;
      this.state.gates['Gate C (South)'].status = 'Congested';
      this.state.gates['Gate C (South)'].load = 'High';
      newIncident = {
        id,
        target: 'Gate C (South)',
        level: 'warning',
        title: 'Gate C Rush Detector',
        description: 'Sudden arrivals from transit hub creating crowd surge at Gate C. Est. queue wait: 22 mins.',
        timestamp: new Date().toLocaleTimeString(),
        aiResolved: false
      };
    } else if (type === 'medical') {
      newIncident = {
        id,
        target: 'Medical Station 2 - Gate D',
        level: 'critical',
        title: 'Medical Aid Call: Section 118',
        description: 'Fan reporting severe heat exhaustion symptoms. Medical dispatcher alert triggered.',
        timestamp: new Date().toLocaleTimeString(),
        aiResolved: false
      };
    } else if (type === 'concession') {
      newIncident = {
        id,
        target: 'Concessions Green Hub - Block 105',
        level: 'warning',
        title: 'Concession Surge Line',
        description: 'Point of sale slowdown at Green Hub concourse. Average waiting time at 14 minutes.',
        timestamp: new Date().toLocaleTimeString(),
        aiResolved: false
      };
    }

    if (newIncident) {
      // Check if duplicate is already active
      const exists = this.state.incidents.some(inc => inc.title === newIncident.title && !inc.aiResolved);
      if (!exists) {
        this.state.incidents.push(newIncident);
        this.broadcastUpdate();
        return newIncident;
      }
    }
    return null;
  }

  /**
   * Marks a target simulator incident resolved and scales down queue ETA.
   * @param {string} id The unique identifier of the incident to resolve.
   * @returns {object|null} The resolved incident details, or null if not found.
   */
  resolveIncident(id) {
    const incidentIndex = this.state.incidents.findIndex(inc => inc.id === id);
    if (incidentIndex !== -1) {
      const incident = this.state.incidents[incidentIndex];
      incident.aiResolved = true;

      // Adjust simulator state corresponding to the incident
      if (incident.target === 'Gate D (West)') {
        this.state.gates['Gate D (West)'].waitTime = 6;
        this.state.gates['Gate D (West)'].status = 'Clear';
        this.state.gates['Gate D (West)'].load = 'Low';
        this.state.gates['Gate D (West)'].resolved = true;
      } else if (incident.target === 'Gate C (South)') {
        this.state.gates['Gate C (South)'].waitTime = GATE_C_RESOLVED_WAIT;
        this.state.gates['Gate C (South)'].status = 'Clear';
        this.state.gates['Gate C (South)'].load = 'Low';
      }

      this.broadcastUpdate();
      return incident;
    }
    return null;
  }

  /**
   * Broadcasts the updated simulator state as a custom browser DOM event.
   * @returns {void}
   */
  broadcastUpdate() {
    // Fire a custom DOM event so the UI can listen and refresh itself cleanly
    const event = new CustomEvent('stadiumUpdate', { detail: this.state });
    window.dispatchEvent(event);
  }
}

// Instantiate simulator globally
window.StadiumSimulator = StadiumSimulator;
window.stadiumSimulator = new StadiumSimulator();
