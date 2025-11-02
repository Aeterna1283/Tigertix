import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App";

// Mock fetch globally
global.fetch = jest.fn();

// Mock LLM component to avoid complications
jest.mock('../../llm.js', () => {
  return function MockLLM() {
    return <div data-testid="mock-llm">LLM Component</div>;
  };
});

beforeEach(() => {
  fetch.mockClear();
  
  // Default mock for fetching events
  fetch.mockResolvedValue({
    ok: true,
    json: async () => [
      {
        event_id: 1,
        event_name: "Tiger Football Game",
        event_date: "2025-11-15",
        event_location: "Memorial Stadium",
        event_tickets: 100
      },
      {
        event_id: 2,
        event_name: "Jazz Night",
        event_date: "2025-11-20",
        event_location: "Brooks Center",
        event_tickets: 50
      },
      {
        event_id: 3,
        event_name: "Basketball Game",
        event_date: "2025-11-22",
        event_location: "Littlejohn Coliseum",
        event_tickets: 0
      }
    ]
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("App Component Rendering", () => {
  
  test("Renders header with TigerTix title", async () => {
    render(<App />);
    expect(screen.getByText(/TigerTix Event Tickets/i)).toBeInTheDocument();
  });

  test("Renders footer with copyright text", async () => {
    render(<App />);
    expect(screen.getByText(/2025 TigerTix/i)).toBeInTheDocument();
  });

  test("Shows loading message initially", () => {
    render(<App />);
    expect(screen.getByText(/Loading events/i)).toBeInTheDocument();
  });
});

describe("App Event Fetching", () => {
  
  test("Fetches events from backend on mount", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:6001/api/events");
    });
  });

  test("Displays events after successful fetch", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    expect(screen.getByText("Jazz Night")).toBeInTheDocument();
    expect(screen.getByText("Basketball Game")).toBeInTheDocument();
  });

  test("Displays event details correctly", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Date: 2025-11-15/)).toBeInTheDocument();
    expect(screen.getByText(/Location: Memorial Stadium/)).toBeInTheDocument();
    expect(screen.getByText(/Tickets Available: 100/)).toBeInTheDocument();
  });

  test("Handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockRejectedValueOnce(new Error("Network error"));
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });
});

describe("App Event Cards", () => {
  
  test("Renders correct number of event cards", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    const eventCards = screen.getAllByRole("article");
    expect(eventCards).toHaveLength(3);
  });

  test("Each event card has required information", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    const cards = screen.getAllByRole("article");
    const firstCard = cards[0];
    
    expect(firstCard).toHaveTextContent("Date:");
    expect(firstCard).toHaveTextContent("Location:");
    expect(firstCard).toHaveTextContent("Tickets Available:");
  });
});

describe("App Ticket Purchase", () => {
  
  test("Buy button is enabled when tickets available", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.textContent === "Buy Ticket" && 
      btn.getAttribute("aria-label")?.includes("Tiger Football Game")
    );
    
    expect(buyButton).toBeTruthy();
    expect(buyButton).not.toBeDisabled();
  });

  test("Buy button is disabled when sold out", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Basketball Game")).toBeInTheDocument();
    });
    
    const buttons = screen.getAllByRole("button");
    const soldOutButton = buttons.find(btn => 
      btn.textContent === "Sold Out" && 
      btn.getAttribute("aria-label")?.includes("Basketball Game")
    );
    
    expect(soldOutButton).toBeTruthy();
    expect(soldOutButton).toBeDisabled();
  });

  test("Clicking buy button makes POST request", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    // Mock the purchase response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Ticket purchased" })
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.textContent === "Buy Ticket" && 
      btn.getAttribute("aria-label")?.includes("Tiger Football Game")
    );
    
    fireEvent.click(buyButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:6001/api/events/1/purchase",
        { method: "POST" }
      );
    });
    
    alertMock.mockRestore();
  });

  test("Ticket count decrements after successful purchase", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tickets Available: 100/)).toBeInTheDocument();
    });
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Ticket purchased" })
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.textContent === "Buy Ticket" && 
      btn.getAttribute("aria-label")?.includes("Tiger Football Game")
    );
    
    fireEvent.click(buyButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Tickets Available: 99/)).toBeInTheDocument();
    });
    
    alertMock.mockRestore();
  });

  test("Shows success alert after purchase", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" })
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.textContent === "Buy Ticket" && 
      btn.getAttribute("aria-label")?.includes("Tiger Football Game")
    );
    
    fireEvent.click(buyButton);
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Ticket purchased successfully!");
    });
    
    alertMock.mockRestore();
  });

  test("Shows error alert on purchase failure", async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Not enough tickets" })
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.textContent === "Buy Ticket" && 
      btn.getAttribute("aria-label")?.includes("Tiger Football Game")
    );
    
    fireEvent.click(buyButton);
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to purchase ticket");
    });
    
    alertMock.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe("App Accessibility", () => {
  
  test("Buy buttons have proper ARIA labels", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
    });
    
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons.find(btn => 
      btn.getAttribute("aria-label") === "Buy ticket for Tiger Football Game"
    );
    
    expect(buyButton).toBeTruthy();
  });

  test("Sold out buttons have proper ARIA labels", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText("Basketball Game")).toBeInTheDocument();
    });
    
    const buttons = screen.getAllByRole("button");
    const soldOutButton = buttons.find(btn => 
      btn.getAttribute("aria-label") === "No more tickets available for Basketball Game"
    );
    
    expect(soldOutButton).toBeTruthy();
  });

  test("Main content is within proper semantic structure", () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("App-main");
  });
});

describe("App State Management", () => {
  
  test("Events state initializes as empty array", () => {
    render(<App />);
    expect(screen.getByText(/Loading events/i)).toBeInTheDocument();
  });

  test("Events state updates after fetch", async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Loading events/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText("Tiger Football Game")).toBeInTheDocument();
  });
});

describe("App LLM Component Integration", () => {
  
  test("LLM component is rendered", () => {
    render(<App />);
    expect(screen.getByTestId("mock-llm")).toBeInTheDocument();
  });
});