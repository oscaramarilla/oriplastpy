import assert from "assert";
import { PRODUCT_CATALOG } from "../config/solicitud-muestra";
import {
  buildSolicitudSummary,
  countDigits,
  isValidEmail,
  validateSelectedProducts,
  validateSolicitud,
  type SolicitudMuestra,
} from "./solicitud-muestra";

function runTests() {
  testIsValidEmail();
  testCountDigits();
  testValidateSelectedProducts();
  testValidateSolicitud();
  testBuildSolicitudSummary();
  console.log("All solicitud-muestra tests passed.");
}

function testIsValidEmail() {
  assert.ok(isValidEmail("contacto@oriplast.com"));
  assert.ok(!isValidEmail("contacto@oriplast"));
  assert.ok(!isValidEmail(""));
}

function testCountDigits() {
  assert.equal(countDigits("+595 981 234 567"), 12);
  assert.equal(countDigits("123-4567"), 7);
  assert.equal(countDigits("abc"), 0);
}

function testValidateSelectedProducts() {
  const valid = validateSelectedProducts([{ id: "tampo-con-travesano", quantity: 2 }]);
  assert.equal(valid.valid, true);

  const noProducts = validateSelectedProducts([]);
  assert.equal(noProducts.valid, false);
  assert.equal(noProducts.errors.productos, "Debes seleccionar al menos un producto.");

  const invalidQty = validateSelectedProducts([{ id: "tampo-con-travesano", quantity: 0 }]);
  assert.equal(invalidQty.valid, false);
  assert.equal(invalidQty.errors.productos, "Cada producto debe tener una cantidad válida mayor a cero.");
}

function testValidateSolicitud() {
  const base: Partial<SolicitudMuestra> = {
    nombre: "María Pérez",
    empresa: "Colegio Nacional",
    email: "contacto@colegio.com",
    telefono: "+595981234567",
    departamento: "Central",
    productos: [{ id: "tampo-con-travesano", quantity: 5 }],
  };

  const valid = validateSolicitud(base);
  assert.equal(valid.valid, true);

  const missing = validateSolicitud({ ...base, empresa: "" });
  assert.equal(missing.valid, false);
  assert.equal(missing.errors.empresa, "La empresa es obligatoria.");

  const badEmail = validateSolicitud({ ...base, email: "bad-email" });
  assert.equal(badEmail.valid, false);
  assert.equal(badEmail.errors.email, "El email debe tener un formato válido.");
}

function testBuildSolicitudSummary() {
  const data: SolicitudMuestra = {
    nombre: "María Pérez",
    empresa: "Colegio Nacional",
    email: "contacto@colegio.com",
    telefono: "+595981234567",
    departamento: "Central",
    productos: [
      { id: "tampo-con-travesano", quantity: 2 },
      { id: "porta-libros", quantity: 1 },
    ],
  };

  const summary = buildSolicitudSummary(data, PRODUCT_CATALOG);
  assert.ok(summary.includes("Nombre: María Pérez"));
  assert.ok(summary.includes("Empresa: Colegio Nacional"));
  assert.ok(summary.includes("- Tampo con travesaño: 2"));
  assert.ok(summary.includes("- Porta libros: 1"));
}

runTests();
