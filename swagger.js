import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Timetable API",
      version: "1.0.0",
      description: "API documentation for the timetable system",
    },
    servers: [
      {
        url: "http://localhost:5000", // Update if using production URL
      },
    ],
  },
  apis: ["./routes/*.js"], // ✅ Automatically scans all route files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
