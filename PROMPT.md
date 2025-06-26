### **Project: Energy Price Tracker MVP**

The goal of the MVP is to build the simplest possible version of the product that solves a core problem for the user. In this case, the core problem is a lack of visibility into energy price fluctuations. This MVP will provide that visibility.

-----

### 1\. The Core Problem & Target User

  * **Problem:** I don't know when electricity is cheap or expensive, so I can't make informed decisions about my energy consumption to save money.
  * **Target User (for MVP):** A technically-inclined user (yourself) who is comfortable running a Python script and wants to analyze historical energy data.

-----

### 2\. MVP Feature Set

#### **Feature 1: Data Acquisition (Python + API)**

This is the foundational component. The script's only job is to fetch data and store it reliably.

  * **Action:** Write a Python script (`fetch_data.py`) that connects to a public energy API and downloads historical price data for a specific region.
  * **Choosing an API:** The most crucial first step is finding a data source.
      * **Recommended (for U.S. Data):** The **U.S. Energy Information Administration (EIA) API**. It's free, well-documented, and reliable. You can get hourly electricity price data for various regions (e.g., "day-ahead hourly prices").
      * **Alternative:** Some utility companies have their own APIs, but they can be harder to access. For a global perspective, sources like the ENTSO-E (for Europe) or Open-Meteo's weather API (which sometimes includes electricity market data) could be options.
  * **Implementation Details:**
      * Use the `requests` library in Python to make GET requests to the API endpoint.
      * The script should retrieve the data, which will likely be in JSON format.
      * Parse the JSON response to extract the key information: `timestamp` and `price` (e.g., in $/MWh or cents/kWh).
      * **Crucial MVP Step: Data Storage.** Store the data locally. For an MVP, a simple **CSV file** is perfect. Each row would contain `timestamp` and `price`. This prevents you from having to call the API every single time you run the analysis.
          * *Script Logic:* Check the last entry in your CSV. Request only new data from the API since that last timestamp. Append new data to the CSV.

#### **Feature 2: Data Visualization (Matplotlib/Plotly)**

This feature addresses the core problem by making the data understandable at a glance.

  * **Action:** Create a second Python script (`visualize.py`), or add a function to the main script, that reads the CSV file and generates a chart.
  * **Implementation Details:**
      * Use the `pandas` library to easily read the CSV data into a DataFrame.
      * **Matplotlib (Recommended for simplicity):**
          * Create a simple line plot.
          * X-axis: `timestamp` (format the dates for readability).
          * Y-axis: `price`.
          * Add a title ("Hourly Energy Price"), and labels for the axes ("Time" and "Price ($/kWh)").
          * The script can display the plot directly or save it as an image file (e.g., `price_chart.png`).
      * **Plotly (Recommended for interactivity):**
          * Similar setup to Matplotlib, but the output will be an interactive HTML file.
          * The key benefit is that you can hover over the data points to see exact values, and you can zoom and pan across the timeline. This is a huge "wow" factor for a small amount of extra effort.

-----

### 3\. Workflow for the MVP

A user's interaction with the MVP would be:

1.  Run the script from the command line: `python main.py`
2.  The script automatically fetches any new price data from the EIA API.
3.  It appends this new data to the `energy_prices.csv` file.
4.  It then generates and displays a chart of the price data over the last 7 days (or another specified period).

-----

### 4\. Technology Stack Summary

| Component           | Technology / Library                                      | Purpose                                                    |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| **Language** | Python 3                                                  | Core logic                                                 |
| **API Communication** | `requests`                                                | To fetch data from the web API                             |
| **Data Handling** | `pandas`                                                  | To read, manipulate, and store data in a structured way    |
| **Data Storage** | CSV file (`energy_prices.csv`)                            | Persistent, simple local storage for historical data       |
| **Visualization** | `matplotlib` or `plotly`                                  | To generate the price chart                                |
| **Automation (Optional)** | `cron` (Linux/macOS) or Windows Task Scheduler      | To run the `fetch_data.py` script automatically (e.g., daily) |

-----

### **Bonus Feature: "Best Time to Run Appliances" Calculator**

This feature moves from just *showing* data to providing an *actionable recommendation*. This is a perfect "next step" after the core MVP is stable.

#### **Logic for the Calculator**

  * **Inputs:**

    1.  `appliance_power_watts`: The power consumption of the appliance in Watts (e.g., Dishwasher = 1800W).
    2.  `run_duration_hours`: How long the appliance needs to run in hours (e.g., Dishwasher = 2 hours).

  * **Process:**

    1.  Load the most recent price data (e.g., last 48 hours) from your CSV into a pandas DataFrame.
    2.  Convert the appliance power to kilowatts: `power_kw = appliance_power_watts / 1000`.
    3.  Use a "sliding window" approach on your hourly price data. For a 2-hour duration, you'd look at the average price for 12am-2am, 1am-3am, 2am-4am, etc.
    4.  Calculate the cost for each possible start time using the formula:
        $$Cost = \text{Price} (\$/kWh) \times \text{Power} (kW) \times \text{Duration} (h)$$
    5.  Find the time window that results in the minimum cost.

  * **Output:**

      * A simple print statement:
        ```
        To run your 1800W appliance for 2 hours:
        - The CHEAPEST window starts at: 03:00 AM
        - The estimated cost would be: $0.24

        - The MOST EXPENSIVE window starts at: 06:00 PM
        - The estimated cost would be: $0.88
        ```

*End. 