import { render } from "react-dom";
import SeatmapFactory, {
  extractConfigurationFromOptions,
  validateOptions,
} from "../index";
import { Props } from "../TicketMap";

jest.mock("react-dom", () => ({
  render: jest.fn((component) => component.ref(component)),
}));

describe("SeatmapFactory", () => {
  let options: Props;

  beforeEach(() => {
    options = {
      venueId: "4",
      configurationId: "10",
    };
  });

  describe("build", () => {
    let factory: SeatmapFactory;

    beforeEach(() => {
      factory = new SeatmapFactory(options);
    });

    it("throws an error if rootElementId is not provided", () => {
      expect(() => factory.build("")).toThrow(
        "Seatmaps must be initialized with a DOM element."
      );
    });

    it("throws an error if rootElementId is not associated with a DOM element", () => {
      expect(() => factory.build("foo")).toThrow(
        "Seatmaps must be initialized with a DOM element."
      );
    });

    it("mounts the TicketMap component into the root element", () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (global as any).document.getElementById = jest.fn(
        () => (global as any).document.body
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */
      factory.build("fooId");
      expect(render).toHaveBeenCalled();
    });
  });

  describe("extractConfigurationFromOptions", () => {
    it("returns an object", () => {
      const result = extractConfigurationFromOptions(options);
      expect(result).toBeInstanceOf(Object);
    });

    it("returns a subset of properties from the input options", () => {
      const result = extractConfigurationFromOptions(options);
      expect(result).toMatchObject(options);
    });

    it("only returns properties from options which are either optional or required config params", () => {
      /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
      const result = extractConfigurationFromOptions({
        ...options,
        ticketGroups: [],
        foo: "bar",
      } as Props);
      /* eslint-enable @typescript-eslint/no-object-literal-type-assertion */
      expect(result).toMatchObject({ ...options, ticketGroups: [] });
    });
  });

  describe("validateOptions", () => {
    it("does not throw an error if all required properties exist in options", () => {
      expect(() => validateOptions(options)).not.toThrow();
    });

    it("throws an error if any required properties are missing from options", () => {
      /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
      expect(() => validateOptions({ venueId: "4" } as Props)).toThrow(
        `Seatmap configuration requires a 'configurationId' value.`
      );
      /* eslint-enable @typescript-eslint/no-object-literal-type-assertion */
    });
  });
});
