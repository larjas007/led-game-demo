
## Hardware preview

<p align="center">
  <img src="wiring-preview-01.jpg" alt="Wiring preview" width="700">
  <img src="wiring-preview-02.jpg" alt="Wiring preview" width="700">
</p>

# Bill of Materials

## Core components

| Item | Qty | Notes | AliExpress |
|---|---:|---|---|
| ESP32 development board | 1 | ESP32 DevKit style board | [Search](https://www.aliexpress.com/wholesale?SearchText=ESP32+development+board+CP2102) |
| WS2812B LED strip, 5V | 1 | Choose the length / LED count closest to your build | [Search](https://www.aliexpress.com/wholesale?SearchText=WS2812B+5V+LED+strip+100+LEDs) |
| Large arcade push button, green | 1 | It's a button, just press it! | [Search](https://www.aliexpress.com/wholesale?SearchText=arcade+push+button+green) |
| Large arcade push button, yellow | 1 | Another button to press | [Search](https://www.aliexpress.com/wholesale?SearchText=arcade+push+button+yellow) |
| Large arcade push button, blue | 1 | Button? press it! | [Search](https://www.aliexpress.com/wholesale?SearchText=arcade+push+button+blue) |
| Passive buzzer module | 1 | For simple tone output | [Search](https://www.aliexpress.com/wholesale?SearchText=passive+buzzer+module+5V) |
| DC-DC buck converter | 1 | Useful if your power setup needs voltage regulation | [Search](https://www.aliexpress.com/wholesale?SearchText=LM2596+buck+converter) |
| Perfboard / prototype board | 1 | For soldered wiring and final assembly | [Search](https://www.aliexpress.com/wholesale?SearchText=prototype+perfboard+pcb) |
| Dupont jumper wires | 1 set | Male-female / female-female *giggity as needed | [Search](https://www.aliexpress.com/wholesale?SearchText=dupont+jumper+wires) |
| 5V power supply | 1 | External 5V strongly recommended for LED strip | [Search](https://www.aliexpress.com/wholesale?SearchText=5V+power+supply+10A) |

*Everything's available at Unit Electronic Shop in Centro Histórico CDMX

*I know blue and green buttons aren't very contrasting, it woul've been red if they weren't sold out :(

## Recommended protection / stability parts

| Item | Qty | Notes | AliExpress |
|---|---:|---|---|
| 330Ω resistor | 1 | Optional on LED data line | [Search](https://www.aliexpress.com/wholesale?SearchText=330+ohm+resistor) |
| 1000µF electrolytic capacitor | 1 | Optional across 5V and GND for strip stability | [Search](https://www.aliexpress.com/wholesale?SearchText=1000uF+electrolytic+capacitor+16V) |
| Screw terminal block | 1 set | Useful for cleaner power connections | [Search](https://www.aliexpress.com/wholesale?SearchText=screw+terminal+block) |
| Heat shrink tubing | 1 pack | Cleaner and safer cable finishing | [Search](https://www.aliexpress.com/wholesale?SearchText=heat+shrink+tube+kit) |

*Everything's available at Unit Electronic Shop in Centro Histórico CDMX

## Notes
- Use a shared ground between the ESP32 and the LED strip.
- Use an external 5V supply for the LED strip instead of powering a long strip directly from the ESP32.
- The 330Ω resistor and 1000µF capacitor are recommended stability parts for addressable LED builds.
- Button wiring in firmware uses internal pull-up logic.


# Wiring and pinout

## ESP32 pin mapping

| Component | Signal / Function | ESP32 Pin | Notes |
|---|---|---:|---|
| WS2812B LED strip | Data In | GPIO 5 | Main LED data line |
| Blue button | Input | GPIO 14 | `INPUT_PULLUP` |
| Green button | Input | GPIO 27 | `INPUT_PULLUP` |
| Yellow button | Input | GPIO 26 | `INPUT_PULLUP` |
| Passive buzzer | Signal | GPIO 25 | Tone output |
| All buttons | Ground | GND | Common ground |
| LED strip | Power | 5V | External 5V recommended |
| LED strip | Ground | GND | Shared ground with ESP32 |

## Button wiring

| Button color | One side | Other side | Notes |
|---|---|---|---|
| Blue | GPIO 14 | GND | Uses internal pull-up |
| Green | GPIO 27 | GND | Uses internal pull-up |
| Yellow | GPIO 26 | GND | Uses internal pull-up |

## LED strip wiring

| LED strip wire | Connects to | Notes |
|---|---|---|
| Data | GPIO 5 | Data input to first LED |
| 5V | External 5V | Do not rely on ESP32 5V for long strips |
| GND | Common GND | Must be shared with ESP32 ground |

## Buzzer wiring

| Buzzer pin | Connects to | Notes |
|---|---|---|
| Signal | GPIO 25 | Used for gameplay tones |
| Ground | GND | Common ground |
