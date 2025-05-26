"use client"

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {FileText, Eye, Download} from "lucide-react"

export function ReportesPDF() {
  
  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Configuración del Reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-medium mb-4">Tipo de Reporte</h4>
            <RadioGroup defaultValue="regeneral">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regeneral" id="r1" />
                <Label htmlFor="r1">Reporte General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recategorias" id="r2" />
                <Label htmlFor="r2">Reporte por Categoría</Label>
              </div>
            </RadioGroup>
            <div className="flex flex-col gap-2 mt-8">
              <Button variant={"default"} className="cursor-pointer bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)]/90">
                <Eye></Eye>
                Vista Previa
              </Button>
              <Button variant={"outline"} className="cursor-pointer">
                <Download></Download>
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 row-span-2">
          <CardHeader>
            <CardTitle>Vista Previa del Reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 h-[484px] rounded-sm">
              <div className="flex flex-col items-center justify-center gap-2">
                <FileText className="h-12 w-12"></FileText>
                <h4 className="font-semibold">Vista Previa del PDF</h4>
                <p>Configure las opciones y presione en "Vista Previa" para ver el reporte.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}